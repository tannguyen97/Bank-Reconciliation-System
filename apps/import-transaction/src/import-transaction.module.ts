import { Module } from '@nestjs/common';
import { ImportTransactionController } from './import-transaction.controller';
import { ImportTransactionService } from './import-transaction.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitmqModule } from '@app/rabbitmq';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [Transaction],
          synchronize: true,
          autoLoadEntities: true
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([Transaction]),
    RabbitmqModule,
  ],
  controllers: [ImportTransactionController],
  providers: [ImportTransactionService],
})
export class ImportTransactionModule {}
