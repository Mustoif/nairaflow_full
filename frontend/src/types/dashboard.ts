export type TransactionType = 'wallet-funding' | 'transfer-sent' | 'transfer-received'

export type TransactionStatus = 'completed' | 'pending' | 'failed'

export type DashboardTransaction = {
  id: string
  description: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  date: string
}

export type DashboardData = {
  availableBalance: number
  transactions: DashboardTransaction[]
}
