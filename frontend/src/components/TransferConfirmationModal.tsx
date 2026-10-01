import type { TransferInput } from '../types/transfer'

type TransferConfirmationModalProps = {
  transfer: TransferInput
  availableBalance: number
  isSubmitting: boolean
  error: string
  onCancel: () => void
  onConfirm: () => Promise<void>
}

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
})

export function TransferConfirmationModal({
  transfer,
  availableBalance,
  isSubmitting,
  error,
  onCancel,
  onConfirm,
}: TransferConfirmationModalProps) {
  const remainingBalance = availableBalance - transfer.amount

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="card funding-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-confirmation-heading"
      >
        <div className="modal-header">
          <div>
            <h2 id="transfer-confirmation-heading" className="heading-2">
              Confirm transfer
            </h2>
            <p className="body-text">Review the transfer before you confirm it.</p>
          </div>
          <button className="modal-close" type="button" onClick={onCancel} disabled={isSubmitting}>
            Close
          </button>
        </div>

        {error && (
          <p className="message message--error" role="alert">
            {error}
          </p>
        )}

        <dl className="transfer-summary">
          <div>
            <dt>Recipient</dt>
            <dd>{transfer.recipient}</dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>{nairaFormatter.format(transfer.amount)}</dd>
          </div>
          {transfer.description && (
            <div>
              <dt>Description</dt>
              <dd>{transfer.description}</dd>
            </div>
          )}
          <div>
            <dt>Current balance</dt>
            <dd>{nairaFormatter.format(availableBalance)}</dd>
          </div>
          <div>
            <dt>Remaining balance</dt>
            <dd>{nairaFormatter.format(remainingBalance)}</dd>
          </div>
        </dl>

        <div className="modal-actions">
          <button className="button button--secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button className="button" type="button" onClick={() => void onConfirm()} disabled={isSubmitting}>
            {isSubmitting ? 'Sending transfer…' : 'Confirm transfer'}
          </button>
        </div>
      </section>
    </div>
  )
}
