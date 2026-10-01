export type WalletTransactionStatus = 'completed' | 'pending' | 'failed'

export type WalletTransaction = {
  id: string
  type: 'funding' | 'transfer'
  direction: 'incoming' | 'outgoing'
  amount: number
  date: string
  status: WalletTransactionStatus
  description: string
  reference: string
  recipient?: string
}

export type WalletData = {
  availableBalance: number
  transactions: WalletTransaction[]
}
