import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ClientProxy, ClientRMQ } from '@nestjs/microservices';
import { Readable } from 'stream';
import { TransactionDto } from './dto/transaction.dto';
import { CsvParser } from 'nest-csv-parser';
import * as xlsx from 'xlsx';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { getExtension } from './util/file.util';
import { IMPORT_STATUS, MAX_MESSAGE_DATA } from './constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './entities/import-status.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(
    @Inject('IMPORTING') private importClient: ClientRMQ,
    private readonly csvParser: CsvParser,
    @InjectRepository(Status) private readonly statusRepository: Repository<Status>
  ) {}

  async uploadCsv(file: Express.Multer.File) {
    const ticket = uuidv4();
    const fileType = getExtension(file?.originalname);
    if(fileType != "csv") throw new BadRequestException(`Support file csv only.`);
   
    const stream = Readable.from(file.buffer);
    const entities: TransactionDto[] = (await this.csvParser.parse(stream, TransactionDto, null, null, { separator: ',' }))?.list;
    if(entities.length > MAX_MESSAGE_DATA) {
      throw new BadRequestException('Support less than or equal to 1,2 milion record');
    }

    this.importClient.send('file_uploaded', entities).subscribe((res) => {
      if(res == "UPLOAD_SUCCESS"){
        this.statusRepository.save({ticket, status: true});
      } else {
        this.statusRepository.save({ticket, status: false});
      }
    });

    return {
      ticket,
      status: IMPORT_STATUS.PROCESSING
    };
  }
   

  async uploadExcel(file: Express.Multer.File) {
    const ticket = uuidv4();
    const fileType = getExtension(file?.originalname);
    if(fileType != "xlsx") throw new BadRequestException(`Support file excel only.`);
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const entities = [];
    for (let row = 1; row < jsonData.length; row++) {
      const [date, content, amount, type]: string[] = jsonData[row] as string[];
      const transactionDto = plainToClass(TransactionDto, { date, content, amount, type});
      const errors = await validate(TransactionDto);

      if (errors.length === 0) {
        entities.push(transactionDto);
      } else {
        throw new BadRequestException(`File content invalid type.`);
      }
    }

    if(entities.length > MAX_MESSAGE_DATA) {
      throw new BadRequestException('Support less than or equal to 1,2 milion record');
    }

    await this.importClient.send('file_uploaded', entities).subscribe((res) => {
      if(res == "UPLOAD_SUCCESS"){
        this.statusRepository.save({ticket, status: true});
      } else {
        this.statusRepository.save({ticket, status: false});
      }
    });

    return {
      ticket,
      status: IMPORT_STATUS.PROCESSING
    };
  }

  async importStatus(ticket: string) {
    const importTicket = await this.statusRepository.findOneBy({ticket});
    if(!importTicket) throw new NotFoundException('Can not found this ticket');
    if(importTicket.status){
      return IMPORT_STATUS.IMPORTED
    }
    return IMPORT_STATUS.FAILED;
  }
}
