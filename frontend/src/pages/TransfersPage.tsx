import { useEffect, useState, useRef, type FormEvent } from 'react'
import { TransferConfirmationModal } from '../components/TransferConfirmationModal'
import { walletService } from '../services'
import type { TransferInput } from '../types/transfer'
import type { WalletData } from '../types/wallet'

type TransferErrors = {
  recipient?: string
  amount?: string
}

const accountNumberPattern = /^\d{6,15}$/

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
})

export function TransfersPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<TransferErrors>({})
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [pendingTransfer, setPendingTransfer] = useState<TransferInput | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const successTimeoutRef = useRef<number | undefined>(undefined)

  async function loadWallet() {
    setError('')
    setWallet(null)

    try {
      const walletData = await walletService.getWallet()
      setWallet(walletData)
    } catch {
      setError('Unable to load your available balance. Please try again.')
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

  function validateTransfer(): TransferInput | null {
    const nextErrors: TransferErrors = {}
    const transferAmount = Number(amount)

    if (!recipient.trim()) {
      nextErrors.recipient = 'Enter the recipient account number.'
    } else if (!accountNumberPattern.test(recipient.trim())) {
      nextErrors.recipient = 'Enter a valid recipient account number (digits only).' 
    }

    if (!amount.trim()) {
      nextErrors.amount = 'Enter an amount to transfer.'
    } else if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
      nextErrors.amount = 'Enter an amount greater than ₦0.'
    } else if (wallet && transferAmount > wallet.availableBalance) {
      nextErrors.amount = 'This amount is more than your available balance.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return null
    }

    return {
      recipient: recipient.trim(),
      amount: transferAmount,
      description: description.trim() || undefined,
    }
  }

  function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccessMessage('')

    const transfer = validateTransfer()

    if (transfer) {
      setPendingTransfer(transfer)
    }
  }

  async function handleConfirmTransfer() {
    if (!pendingTransfer) {
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const updatedWallet = await walletService.transfer(pendingTransfer)
      setWallet(updatedWallet)
      setPendingTransfer(null)
      setRecipient('')
      setAmount('')
      setDescription('')
      setErrors({})
      setSuccessMessage('Transfer completed successfully.')
    } catch (transferError) {
      setError(
        transferError instanceof Error ? transferError.message : 'Unable to complete the transfer. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error && !wallet) {
    return (
      <section id="transfers" className="transfer-page" aria-labelledby="transfers-heading">
        <h1 id="transfers-heading" className="heading-1">
          Transfer Money
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
      <section id="transfers" className="transfer-page" aria-labelledby="transfers-heading">
        <h1 id="transfers-heading" className="heading-1">
          Transfer Money
        </h1>
        <p className="dashboard-loading" role="status">
          Loading your available balance…
        </p>
      </section>
    )
  }

  return (
    <section id="transfers" className="transfer-page" aria-labelledby="transfers-heading">
      <div className="transfer-header">
        <div>
          <h1 id="transfers-heading" className="heading-1">
            Transfer Money
          </h1>
          <p className="body-text">Send money securely from your wallet.</p>
        </div>
      </div>

      {successMessage && (
        <p className="message message--success" role="status">
          {successMessage}
        </p>
      )}

      {error && (
        <p className="message message--error" role="alert">
          {error}
        </p>
      )}

      <div className="card transfer-balance">
        <span>Available balance</span>
        <strong>{nairaFormatter.format(wallet.availableBalance)}</strong>
        <p className="body-text">Available balance · NGN</p>
      </div>

      <form className="card transfer-form" onSubmit={handleReview} noValidate>
        <div>
          <label className="label" htmlFor="transfer-recipient">
            Recipient Account Number
          </label>
          <input
            id="transfer-recipient"
            className="input"
            type="text"
            inputMode="numeric"
            placeholder="1002457812"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value.replace(/\D/g, ''))}
            aria-invalid={Boolean(errors.recipient)}
            aria-describedby={errors.recipient ? 'transfer-recipient-error' : undefined}
          />
          {errors.recipient && (
            <p id="transfer-recipient-error" className="field-error">
              {errors.recipient}
            </p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="transfer-amount">
            Amount in NGN
          </label>
          <input
            id="transfer-amount"
            className="input"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            placeholder="50,000"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? 'transfer-amount-error' : undefined}
          />
          {errors.amount && (
            <p id="transfer-amount-error" className="field-error">
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="transfer-description">
            Description or reference <span className="optional-label">(optional)</span>
          </label>
          <input
            id="transfer-description"
            className="input"
            type="text"
            placeholder="e.g. September rent"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <button className="button" type="submit">
          Continue to review
        </button>
      </form>

      {pendingTransfer && (
        <TransferConfirmationModal
          transfer={pendingTransfer}
          availableBalance={wallet.availableBalance}
          isSubmitting={isSubmitting}
          error={error}
          onCancel={() => {
            if (!isSubmitting) {
              setPendingTransfer(null)
              setError('')
            }
          }}
          onConfirm={handleConfirmTransfer}
        />
      )}
    </section>
  )
}
