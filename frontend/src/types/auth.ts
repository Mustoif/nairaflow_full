export type User = {
  id: string
  fullName: string
  email: string
  accountNumber: string
}

export type RegisterInput = {
  fullName: string
  email: string
  password: string
}

export type LoginInput = {
  email: string
  password: string
}

export type AuthResponse = {
  user: User
  token: string
}
