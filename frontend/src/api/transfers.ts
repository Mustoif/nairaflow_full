import { apiClient } from './client'
import type { TransferInput } from '../types/transfer'
import type { WalletData } from '../types/wallet'

export const transfersApi = {
  async sendTransfer(input: TransferInput, token: string): Promise<WalletData> {
    return apiClient.post<WalletData>('/transfers', input, token)
  },
}
