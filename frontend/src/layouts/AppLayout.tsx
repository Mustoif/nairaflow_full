import { useState, type ReactNode } from 'react'
import { NavigationItem } from '../components/NavigationItem'

type AppLayoutProps = {
  children?: ReactNode
  onLogout?: () => void
  activePage?: 'dashboard' | 'wallet' | 'transfers' | 'transactions' | 'profile'
  onNavigate?: (page: 'dashboard' | 'wallet' | 'transfers' | 'transactions' | 'profile') => void
}

const navigationItems = [
  { label: 'Dashboard', href: '#dashboard', page: 'dashboard' as const },
  { label: 'Wallet', href: '#wallet', page: 'wallet' as const },
  { label: 'Transfers', href: '#transfers', page: 'transfers' as const },
  { label: 'Transactions', href: '#transactions', page: 'transactions' as const },
  { label: 'Profile', href: '#profile', page: 'profile' as const },
]

export function AppLayout({ children, onLogout, activePage, onNavigate }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="app-layout">
      <header className="mobile-header">
        <a
          className="brand"
          href="#dashboard"
          onClick={() => {
            onNavigate?.('dashboard')
            closeMobileMenu()
          }}
        >
          NairaFlow
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-controls="app-navigation"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        >
          Menu
        </button>
      </header>

      <aside
        id="app-navigation"
        className={`app-sidebar${isMobileMenuOpen ? ' app-sidebar--open' : ''}`}
      >
        <a
          className="brand"
          href="#dashboard"
          onClick={() => {
            onNavigate?.('dashboard')
            closeMobileMenu()
          }}
        >
          NairaFlow
        </a>

        <nav className="sidebar-navigation" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.label}
              {...item}
              isActive={item.page === activePage}
              onClick={() => {
                if (item.page) {
                  onNavigate?.(item.page)
                }

                closeMobileMenu()
              }}
            />
          ))}
        </nav>

        <button className="logout-button" bg-color="green" text-color="white" type="button" onClick={onLogout}>
          Log out
        </button>
      </aside>

      <main className="app-main">
        {children ?? (
          <section className="welcome-placeholder" aria-labelledby="welcome-heading">
            <h1 id="welcome-heading" className="heading-1">
              Welcome to NairaFlow
            </h1>
            <p className="body-text">
              Your wallet experience will appear here as the application is built.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}
