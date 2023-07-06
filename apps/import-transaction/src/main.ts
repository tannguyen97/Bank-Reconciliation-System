import { NestFactory } from '@nestjs/core';
import { ImportTransactionModule } from './import-transaction.module';
import { RabbitmqService } from '@app/rabbitmq';
import { RmqOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const rmqUri = process.env.RABBIT_MQ_URI;
  const rmqQueue = process.env.RABBIT_MQ_IMPORTING_QUEUE
  const app = await NestFactory.createMicroservice<RmqOptions>(ImportTransactionModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rmqUri],
      queue: rmqQueue,
      noAck:false,
      persistent: true,
    },
  });
  
  app.listen();
}
bootstrap();
