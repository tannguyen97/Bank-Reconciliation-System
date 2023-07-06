import { Controller, Get } from '@nestjs/common';
import { ImportTransactionService } from './import-transaction.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitmqService } from '@app/rabbitmq';

@Controller()
export class ImportTransactionController {
  constructor(
    private readonly importTransactionService: ImportTransactionService,
    private readonly rabbitmqService: RabbitmqService
  ) {}

  @Get()
  getHello(): string {
    return this.importTransactionService.getHello();
  }

  @MessagePattern('csv_uploaded')
  import(@Payload() data: any, @Ctx() context: RmqContext) {
    this.importTransactionService.import(data);
    this.rabbitmqService.ack(context);
  }
}
