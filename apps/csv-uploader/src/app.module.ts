import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqModule } from '@app/rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_IMPORTING_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/csv-uploader/.env',
    }),
    RabbitmqModule.register({name:'IMPORTING'})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
