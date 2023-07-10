import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy, ClientRMQ } from '@nestjs/microservices';
import { Readable } from 'stream';
import { TransactionDto } from './dto/transaction.dto';
import { CsvParser } from 'nest-csv-parser';
import * as xlsx from 'xlsx';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { getExtension } from './util/file.util';
import { MAX_MESSAGE_DATA } from './constant';

@Injectable()
export class AppService {
  constructor(
    @Inject('IMPORTING') private importClient: ClientRMQ,
    private readonly csvParser: CsvParser
  ) {}

  async uploadCsv(file: Express.Multer.File) {
    const fileType = getExtension(file?.originalname);
    if(fileType != "csv") throw new BadRequestException(`Support file csv only.`);
   
    const stream = Readable.from(file.buffer);
    const entities: TransactionDto[] = (await this.csvParser.parse(stream, TransactionDto, null, null, { separator: ',' }))?.list;
    if(entities.length > MAX_MESSAGE_DATA) {
      throw new BadRequestException('Support less than or equal to 1,2 milion record');
    }

    this.importClient.send('file_uploaded', entities).subscribe((res) => {
      console.log(res);
    });

    return "Upload success";
  }
   

  async uploadExcel(file: Express.Multer.File) {
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
      console.log(res);
    });

    return "Upload success";
  }
}
