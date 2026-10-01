import { apiClient } from './client'
import type { DashboardData } from '../types/dashboard'

export const dashboardApi = {
  getDashboard(token: string, options: { includeTransactions?: boolean } = {}): Promise<DashboardData> {
    const query = options.includeTransactions === false ? '?includeTransactions=false' : ''
    return apiClient.get<DashboardData>(`/dashboard${query}`, token)
  },
}
