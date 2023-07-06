enum TracsactionType {
    DEPOSIT = 'deposit'

}
export class TransactionDto {
    date: Date
    content: string
    amount: number
    type: string
}