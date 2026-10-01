import { apiClient } from './client'
import type { WalletTransaction } from '../types/wallet'

export const transactionsApi = {
  async getTransactions(token: string): Promise<WalletTransaction[]> {
    return apiClient.get<WalletTransaction[]>('/transactions', token)
  },

  async getTransaction(id: string, token: string): Promise<WalletTransaction> {
    return apiClient.get<WalletTransaction>(`/transactions/${id}`, token)
  },
}
