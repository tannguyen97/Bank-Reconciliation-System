import { Test, TestingModule } from '@nestjs/testing';
import { ImportTransactionController } from './import-transaction.controller';
import { ImportTransactionService } from './import-transaction.service';
import { RabbitmqModule } from '@app/rabbitmq';
import { ConfigModule } from '@nestjs/config';

describe('ImportTransactionController', () => {
  let importTransactionController: ImportTransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ImportTransactionController],
      imports: [
        ConfigModule.forRoot({
        isGlobal: true,
        // validationSchema: Joi.object({
        //   RABBIT_MQ_URI: Joi.string().required(),
        //   RABBIT_MQ_BILLING_QUEUE: Joi.string().required(),
        // }),
      }),
      RabbitmqModule],
      providers: [ImportTransactionService],
    }).compile();

    importTransactionController = app.get<ImportTransactionController>(ImportTransactionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(importTransactionController.getHello()).toBe('Hello World!');
    });
  });
});
