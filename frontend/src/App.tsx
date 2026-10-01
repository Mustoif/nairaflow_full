import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { ForgotPasswordPage, LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { TransfersPage } from './pages/TransfersPage'
import { WalletPage } from './pages/WalletPage'

type AuthScreen = 'login' | 'register' | 'forgot-password'
type AppPage = 'dashboard' | 'wallet' | 'transfers' | 'transactions' | 'profile'

export function App() {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login')
  const [activePage, setActivePage] = useState<AppPage>('dashboard')

  if (isLoading) {
    return <main className="auth-page"><p className="dashboard-loading">Loading your session…</p></main>
  }

  function handleLogout() {
    logout()
    setAuthScreen('login')
    setActivePage('dashboard')
  }

  if (isAuthenticated) {
    return (
      <AppLayout activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout}>
        {activePage === 'wallet' ? (
          <WalletPage />
        ) : activePage === 'transfers' ? (
          <TransfersPage />
        ) : activePage === 'transactions' ? (
          <TransactionsPage />
        ) : activePage === 'profile' ? (
          <ProfilePage />
        ) : (
          <DashboardPage onNavigate={setActivePage} />
        )}
      </AppLayout>
    )
  }

  if (authScreen === 'register') {
    return <RegisterPage onShowLogin={() => setAuthScreen('login')} />
  }

  if (authScreen === 'forgot-password') {
    return <ForgotPasswordPage onBackToLogin={() => setAuthScreen('login')} />
  }

  return (
    <LoginPage
      onShowRegister={() => setAuthScreen('register')}
      onShowForgotPassword={() => setAuthScreen('forgot-password')}
    />
  )
}
