import { useState, type FormEvent } from 'react'

type FundingModalProps = {
  isSubmitting: boolean
  error: string
  onClose: () => void
  onSubmit: (amount: number) => Promise<void>
}

export function FundingModal({ isSubmitting, error, onClose, onSubmit }: FundingModalProps) {
  const [amount, setAmount] = useState('')
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const fundingAmount = Number(amount)

    if (!amount.trim() || !Number.isFinite(fundingAmount) || fundingAmount <= 0) {
      setValidationError('Enter an amount greater than ₦0.')
      return
    }

    setValidationError('')
    await onSubmit(fundingAmount)
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="card funding-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="funding-modal-heading"
      >
        <div className="modal-header">
          <div>
            <h2 id="funding-modal-heading" className="heading-2">
              Fund wallet
            </h2>
            <p className="body-text">Add funds to your NairaFlow wallet.</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} disabled={isSubmitting}>
            Close
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {(validationError || error) && (
            <p className="message message--error" role="alert">
              {validationError || error}
            </p>
          )}

          <div>
            <label className="label" htmlFor="funding-amount">
              Amount in NGN
            </label>
            <input
              id="funding-amount"
              className="input"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="50,000"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              aria-invalid={Boolean(validationError || error)}
            />
          </div>

          <div className="modal-actions">
            <button className="button button--secondary" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button className="button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Funding wallet…' : 'Fund wallet'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
