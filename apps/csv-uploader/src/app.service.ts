import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ, RmqRecordBuilder } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('IMPORTING') private importClient: ClientRMQ
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async uploadCsv() {
    this.importClient.send('csv_uploaded', 'Test').subscribe((data) => {
      return data;
    });

    return;
  } 
}
