import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class ImportTransactionService {
  constructor( 
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>
  ) {}

  async import(data: TransactionDto[]) {
    const batchSize = 1000;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await this.transactionRepository
        .createQueryBuilder()
        .insert()
        .into(Transaction)
        .values(batch)
        .execute();
    }
  }
}
