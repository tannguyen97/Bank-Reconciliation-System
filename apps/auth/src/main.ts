import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { RmqOptions } from '@nestjs/microservices';
import { RabbitmqService } from '@app/rabbitmq'
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  // const app = await NestFactory.create(AuthModule);
  // const configService = app.get(ConfigService);
  // await app.listen(configService.get('PORT'));
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get<RabbitmqService>(RabbitmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true));
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
