import { DynamicModule, Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

interface RmqModuleOptions {
    name: string;
}

@Module({
    providers: [RabbitmqService],
    exports: [RabbitmqService],
})
export class RabbitmqModule {
    static register({ name }: RmqModuleOptions): DynamicModule {
        return {
            module: RabbitmqModule,
            imports: [
                ClientsModule.registerAsync([
                    {
                        name,
                        useFactory: (configService: ConfigService) => ({
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBIT_MQ_URI')],
                                queue: configService.get<string>(`RABBIT_MQ_${name}_QUEUE`)
                                // urls: ['amqp://user:admin123@localhost:5672'],
                                // queue: 'importing_transaction'
                            },
                        }),
                        inject: [ConfigService],
                    },
                ]),
            ],
            exports: [ClientsModule],
        };
    }
}
