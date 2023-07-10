import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { RabbitmqModule } from '../../rabbitmq/src';

@Module({
  imports: [RabbitmqModule.register({name: 'AUTH'})],
  exports: [RabbitmqModule],
})
export class AuthlibModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
