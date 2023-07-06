import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from '@app/rabbitmq'

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // validationSchema: Joi.object({
          //   MONGODB_URI: Joi.string().required(),
          //   PORT: Joi.number().required(),
          // }),
          envFilePath: './apps/csv-uploader/.env',
          }),
          RabbitmqModule.register({name:'IMPORTING'})
        ],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
