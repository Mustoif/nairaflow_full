import { useEffect, useState, useRef } from 'react'
import { BalanceCard } from '../components/BalanceCard'
import { FundingModal } from '../components/FundingModal'
import { WalletTransactions } from '../components/WalletTransactions'
import { walletService } from '../services'
import type { WalletData } from '../types/wallet'

export function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [error, setError] = useState('')
  const [fundingError, setFundingError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false)
  const [isFunding, setIsFunding] = useState(false)
  const successTimeoutRef = useRef<number | undefined>(undefined)

  async function loadWallet() {
    setError('')
    setWallet(null)

    try {
      const walletData = await walletService.getWallet()
      setWallet(walletData)
    } catch {
      setError('Unable to load your wallet. Please try again.')
    }
  }

  useEffect(() => {
    void loadWallet()
  }, [])

  useEffect(() => {
    if (successMessage) {
      successTimeoutRef.current = window.setTimeout(() => setSuccessMessage(''), 5000)
    }
    return () => {
      if (successTimeoutRef.current) window.clearTimeout(successTimeoutRef.current)
    }
  }, [successMessage])

  function openFundingModal() {
    setFundingError('')
    setSuccessMessage('')
    setIsFundingModalOpen(true)
  }

  function closeFundingModal() {
    if (!isFunding) {
      setIsFundingModalOpen(false)
    }
  }

  async function handleFunding(amount: number) {
    setFundingError('')
    setIsFunding(true)

    try {
      const updatedWallet = await walletService.fundWallet(amount)
      setWallet(updatedWallet)
      setIsFundingModalOpen(false)
      setSuccessMessage('Wallet funded successfully. This was a  transaction.')
    } catch (fundingError) {
      setFundingError(
        fundingError instanceof Error ? fundingError.message : 'Unable to fund your wallet. Please try again.',
      )
    } finally {
      setIsFunding(false)
    }
  }

  if (error) {
    return (
      <section id="wallet" className="wallet-page" aria-labelledby="wallet-heading">
        <h1 id="wallet-heading" className="heading-1">
          Wallet
        </h1>
        <div className="card dashboard-feedback">
          <p className="message message--error" role="alert">
            {error}
          </p>
          <button className="button button--secondary" type="button" onClick={loadWallet}>
            Try again
          </button>
        </div>
      </section>
    )
  }

  if (!wallet) {
    return (
      <section id="wallet" className="wallet-page" aria-labelledby="wallet-heading">
        <h1 id="wallet-heading" className="heading-1">
          Wallet
        </h1>
        <p className="dashboard-loading" role="status">
          Loading your wallet…
        </p>
      </section>
    )
  }

  return (
    <section id="wallet" className="wallet-page" aria-labelledby="wallet-heading">
      <div className="wallet-header">
        <div>
          <h1 id="wallet-heading" className="heading-1">
            Wallet
          </h1>
          <p className="body-text">Manage your wallet balance with  funding.</p>
        </div>
        <button className="button" type="button" onClick={openFundingModal}>
          Fund wallet
        </button>
      </div>

      {successMessage && (
        <p className="message message--success" role="status">
          {successMessage}
        </p>
      )}

      <BalanceCard balance={wallet.availableBalance} />
      <WalletTransactions transactions={wallet.transactions} />

      {isFundingModalOpen && (
        <FundingModal
          isSubmitting={isFunding}
          error={fundingError}
          onClose={closeFundingModal}
          onSubmit={handleFunding}
        />
      )}
    </section>
  )
}
