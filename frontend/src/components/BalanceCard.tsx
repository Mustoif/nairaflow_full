type BalanceCardProps = {
  balance: number
}

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
})

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <section className="balance-card" aria-labelledby="balance-heading">
      <p id="balance-heading" className="balance-label">
        Available balance
      </p>
      <p className="balance-amount">{nairaFormatter.format(balance)}</p>
      <p className="balance-note">Available balance · NGN</p>
    </section>
  )
}
