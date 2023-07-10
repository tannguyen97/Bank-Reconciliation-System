enum TracsactionType {
    DEPOSIT = 'deposit',
    WITHRAW = 'withdraw'
}
export class TransactionDto {
    date: string
    content: string
    amount: number
    type: TracsactionType
}