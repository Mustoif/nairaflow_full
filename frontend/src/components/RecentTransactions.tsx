import type { DashboardTransaction, TransactionType } from '../types/dashboard'
import { EmptyState } from './EmptyState'

type RecentTransactionsProps = {
  transactions: DashboardTransaction[]
}

const typeLabels: Record<TransactionType, string> = {
  'wallet-funding': 'Wallet funding',
  'transfer-sent': 'Transfer sent',
  'transfer-received': 'Transfer received',
}

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function isIncomingTransaction(type: TransactionType) {
  return type === 'wallet-funding' || type === 'transfer-received'
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <section className="card transactions-card" aria-labelledby="recent-transactions-heading">
      <div className="section-heading">
        <div>
          <h2 id="recent-transactions-heading" className="heading-3">
            Recent transactions
          </h2>
          <p className="body-text">Your latest wallet activity.</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="When you fund your wallet or make a transfer, it will appear here."
        />
      ) : (
        <div className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Type</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const isIncoming = isIncomingTransaction(transaction.type)

                return (
                  <tr key={transaction.id}>
                    <td>{transaction.description}</td>
                    <td>{typeLabels[transaction.type]}</td>
                    <td
                      className={
                        isIncoming ? 'transaction-amount transaction-amount--incoming' : 'transaction-amount'
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
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
