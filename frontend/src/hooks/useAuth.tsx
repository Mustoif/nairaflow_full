import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authApi } from '../api/auth'
import type { LoginInput, RegisterInput, User } from '../types/auth'

const TOKEN_KEY = 'nairaflow_access_token'

type ProfileInput = {
  firstName: string
  lastName: string
}

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  register: (input: RegisterInput) => Promise<void>
  login: (input: LoginInput) => Promise<void>
  updateProfile: (input: ProfileInput) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi.getMe(token)
      .then(setUser)
      .catch(() => {
        clearToken()
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  async function register(input: RegisterInput) {
    const result = await authApi.register(input)
    saveToken(result.token)
    setUser(result.user)
  }

  async function login(input: LoginInput) {
    const result = await authApi.login(input)
    saveToken(result.token)
    setUser(result.user)
  }

  async function updateProfile(input: ProfileInput) {
    const token = getAuthToken()
    if (!token) throw new Error('You must be signed in to update your profile.')
    const updatedUser = await authApi.updateProfile(input, token)
    setUser(updatedUser)
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        register,
        login,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside AuthProvider')
  return auth
}
