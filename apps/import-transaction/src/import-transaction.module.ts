import { Module } from '@nestjs/common';
import { ImportTransactionController } from './import-transaction.controller';
import { ImportTransactionService } from './import-transaction.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from '@app/rabbitmq';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_IMPORTING_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/import-transaction/.env',
    }),
    RabbitmqModule,
  ],
  controllers: [ImportTransactionController],
  providers: [ImportTransactionService],
})
export class ImportTransactionModule {}
