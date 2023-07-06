import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ImportTransactionService {
  getHello(): string {
    return 'Hello World!';
  }

  import(data: any) {
    Logger.log(data);
    console.log(data);
    return data;
  }
}
