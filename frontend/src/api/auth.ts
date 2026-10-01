import { apiClient } from './client'
import type { AuthResponse, LoginInput, RegisterInput, User } from '../types/auth'

export const authApi = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', input)
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', input)
  },

  async getMe(token: string): Promise<User> {
    return apiClient.get<User>('/users/me', token)
  },

  async updateProfile(input: { firstName: string; lastName: string }, token: string): Promise<User> {
    return apiClient.patch<User>('/users/me', input, token)
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/forgot-password', { email })
  },
}
