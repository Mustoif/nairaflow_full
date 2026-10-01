import { apiClient } from './client'
import type { WalletData } from '../types/wallet'

export const walletApi = {
  async getWallet(token: string): Promise<WalletData> {
    return apiClient.get<WalletData>('/wallet', token)
  },

  async fundWallet(amount: number, token: string): Promise<WalletData> {
    return apiClient.post<WalletData>('/wallet/fund', { amount }, token)
  },
}
