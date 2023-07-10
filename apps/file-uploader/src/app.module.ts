import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitmqModule } from '@app/rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { CsvModule } from 'nest-csv-parser';
import { AuthlibModule } from '@app/authlib';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/import-status.entity';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_IMPORTING_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/file-uploader/.env',
    }),
    AuthlibModule,
    RabbitmqModule.register({name:'IMPORTING'}),
    CsvModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [Status],
          synchronize: true,
          autoLoadEntities: true
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Status]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
