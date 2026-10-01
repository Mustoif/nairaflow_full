import { useEffect, useState, type KeyboardEvent } from 'react'
import { EmptyState } from '../components/EmptyState'
import { transactionsService } from '../services'
import type { WalletTransaction } from '../types/wallet'

type FilterType = 'all' | 'funding' | 'transfer'

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function getTransactionTypeLabel(transaction: WalletTransaction) {
  if (transaction.type === 'funding') {
    return 'Wallet funding'
  }

  return transaction.direction === 'incoming' ? 'Transfer received' : 'Transfer sent'
}

function getDirectionLabel(transaction: WalletTransaction) {
  return transaction.direction === 'incoming' ? 'Incoming' : 'Outgoing'
}

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<WalletTransaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadTransactions() {
    setError('')
    setLoading(true)

    try {
      const data = await transactionsService.getTransactions()
      setTransactions(data)
      setFilteredTransactions(data)
    } catch {
      setError('Unable to load your transactions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTransactions()
  }, [])

  useEffect(() => {
    if (filter === 'all') {
      setFilteredTransactions(transactions)
    } else {
      setFilteredTransactions(transactions.filter((transaction) => transaction.type === filter))
    }
  }, [filter, transactions])

  function handleTransactionKeyDown(event: KeyboardEvent<HTMLTableRowElement>, transaction: WalletTransaction) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setSelectedTransaction(transaction)
    }
  }

  if (loading) {
    return (
      <section id="transactions" className="transactions-page" aria-labelledby="transactions-heading">
        <h1 id="transactions-heading" className="heading-1">
          Transactions
        </h1>
        <p className="dashboard-loading" role="status">
          Loading your transactions…
        </p>
      </section>
    )
  }

  if (error) {
    return (
      <section id="transactions" className="transactions-page" aria-labelledby="transactions-heading">
        <h1 id="transactions-heading" className="heading-1">
          Transactions
        </h1>
        <div className="card dashboard-feedback">
          <p className="message message--error" role="alert">
            {error}
          </p>
          <button className="button button--secondary" type="button" onClick={loadTransactions}>
            Try again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="transactions" className="transactions-page" aria-labelledby="transactions-heading">
      <div className="transactions-header">
        <div>
          <h1 id="transactions-heading" className="heading-1">
            Transactions
          </h1>
          <p className="body-text">Your complete wallet transaction history.</p>
        </div>
        <div className="filter-tabs" role="tablist" aria-label="Filter transactions">
          {(['all', 'funding', 'transfer'] as FilterType[]).map((type) => (
            <button
              key={type}
              role="tab"
              aria-selected={filter === type}
              className={`filter-tab${filter === type ? ' filter-tab--active' : ''}`}
              type="button"
              onClick={() => setFilter(type)}
            >
              {type === 'all' ? 'All' : type === 'funding' ? 'Funding' : 'Transfers'}
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No transactions found"
            description={
              filter === 'all'
                ? 'Your wallet transactions will appear here.'
                : `No ${filter} transactions found.`
            }
          />
        </div>
      ) : (
        <div className="card transactions-card">
          <div className="transaction-table-wrapper">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">Type</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date</th>
                  <th scope="col">Reference</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => {
                  const isIncoming = transaction.direction === 'incoming'

                  return (
                    <tr
                      key={transaction.id}
                      className="transaction-row"
                      tabIndex={0}
                      onClick={() => setSelectedTransaction(transaction)}
                      onKeyDown={(event) => handleTransactionKeyDown(event, transaction)}
                    >
                      <td>{transaction.description}</td>
                      <td>{getTransactionTypeLabel(transaction)}</td>
                      <td
                        className={
                          isIncoming
                            ? 'transaction-amount transaction-amount--incoming'
                            : 'transaction-amount'
                        }
                      >
                        {isIncoming ? '+' : '-'}
                        {nairaFormatter.format(transaction.amount)}
                      </td>
                      <td>
                        <span className={`status-badge status-badge--${transaction.status}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>{dateFormatter.format(new Date(transaction.date))}</td>
                      <td>{transaction.reference}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedTransaction && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedTransaction(null)}>
          <section
            className="card funding-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-details-heading"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2 id="transaction-details-heading" className="heading-2">
                  Transaction details
                </h2>
                <p className="body-text">Review the selected wallet activity.</p>
              </div>
              <button
                className="modal-close"
                type="button"
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </button>
            </div>

            <dl className="transfer-summary">
              <div>
                <dt>Reference</dt>
                <dd>{selectedTransaction.reference}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{getTransactionTypeLabel(selectedTransaction)}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>{nairaFormatter.format(selectedTransaction.amount)}</dd>
              </div>
              <div>
                <dt>Direction</dt>
                <dd>{getDirectionLabel(selectedTransaction)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={`status-badge status-badge--${selectedTransaction.status}`}>
                    {selectedTransaction.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{dateFormatter.format(new Date(selectedTransaction.date))}</dd>
              </div>
              <div>
                <dt>Description</dt>
                <dd>{selectedTransaction.description}</dd>
              </div>
              {selectedTransaction.recipient && (
                <div>
                  <dt>Recipient</dt>
                  <dd>{selectedTransaction.recipient}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      )}
    </section>
  )
}
