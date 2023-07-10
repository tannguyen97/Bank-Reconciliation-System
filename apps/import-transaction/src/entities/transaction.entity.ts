import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum TransactionType {
    DEPOSIT = 'deposit',
    WITHRAW = 'withdraw'
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'date'})
    date: string

    @Column()
    content: string

    @Column()
    amount: number

    @Column({type: 'enum', enum: TransactionType})
    type: string   
}