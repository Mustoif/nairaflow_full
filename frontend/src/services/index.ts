import { dashboardApi } from '../api/dashboard'
import { transactionsApi } from '../api/transactions'
import { transfersApi } from '../api/transfers'
import { walletApi } from '../api/wallet'
import { getAuthToken } from '../hooks/useAuth'
import type { DashboardData } from '../types/dashboard'
import type { TransferInput } from '../types/transfer'
import type { WalletData, WalletTransaction } from '../types/wallet'

function getToken(): string {
  const token = getAuthToken()
  if (!token) throw new Error('Your session has expired. Please log in again.')
  return token
}

export const walletService = {
  getWallet: () => walletApi.getWallet(getToken()),
  fundWallet: (amount: number) => walletApi.fundWallet(amount, getToken()),
  transfer: (input: TransferInput) => transfersApi.sendTransfer(input, getToken()),
}

export const transactionsService = {
  getTransactions: (): Promise<WalletTransaction[]> => transactionsApi.getTransactions(getToken()),
  getTransaction: (id: string): Promise<WalletTransaction> =>
    transactionsApi.getTransaction(id, getToken()),
}

export const dashboardService = {
  getDashboardData: (options?: { includeTransactions?: boolean }): Promise<DashboardData> =>
    dashboardApi.getDashboard(getToken(), options),
}
