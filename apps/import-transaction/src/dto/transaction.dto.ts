import { IsDateString, IsEnum, IsNumber, IsString } from "class-validator"

enum TracsactionType {
    DEPOSIT = 'deposit',
    WITHRAW = 'withdraw'
}
export class TransactionDto {
    @IsDateString()
    date: string

    @IsString()
    content: string

    @IsNumber()
    amount: number

    @IsEnum(TracsactionType)
    type: string
}