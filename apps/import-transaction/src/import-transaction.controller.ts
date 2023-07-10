import { Controller, Get, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ImportTransactionService } from './import-transaction.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitmqService } from '@app/rabbitmq';
import { TransactionDto } from './dto/transaction.dto';

@Controller()
export class ImportTransactionController {
  constructor(
    private readonly importTransactionService: ImportTransactionService,
    private readonly rabbitmqService: RabbitmqService
  ) {}

  @MessagePattern('file_uploaded')
  import(@Payload() data: TransactionDto[], @Ctx() context: RmqContext) {
    try {
      this.importTransactionService.import(data);
      this.rabbitmqService.ack(context);
      return "upload success";
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
