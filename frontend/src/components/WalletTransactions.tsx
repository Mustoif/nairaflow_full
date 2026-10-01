import type { WalletTransaction } from '../types/wallet'
import { EmptyState } from './EmptyState'

type WalletTransactionsProps = {
  transactions: WalletTransaction[]
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
  hour: 'numeric',
  minute: '2-digit',
})

export function WalletTransactions({ transactions }: WalletTransactionsProps) {
  return (
    <section className="card transactions-card" aria-labelledby="wallet-transactions-heading">
      <div className="section-heading">
        <div>
          <h2 id="wallet-transactions-heading" className="heading-3">
            Wallet transactions
          </h2>
          <p className="body-text">Funding and transfer activity for this wallet.</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No wallet transactions yet"
          description="Your wallet funding and transfers will appear here."
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
                <th scope="col">Reference</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const isIncoming = transaction.direction === 'incoming'

                return (
                  <tr key={transaction.id}>
                    <td>{transaction.description}</td>
                    <td>{transaction.type === 'funding' ? 'Wallet funding' : 'Transfer sent'}</td>
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
                      <span className="status-badge status-badge--completed">
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
      )}
    </section>
  )
}
