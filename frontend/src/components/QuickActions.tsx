type QuickActionsProps = {
  onNavigate: (page: 'wallet' | 'transfers') => void
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <section className="quick-actions" aria-labelledby="quick-actions-heading">
      <div>
        <h2 id="quick-actions-heading" className="heading-3">
          Quick actions
        </h2>
        <p className="body-text">Common wallet actions.</p>
      </div>

      <div className="quick-action-buttons">
        <button className="button" type="button" onClick={() => onNavigate('wallet')}>
          Fund wallet
        </button>
        <button className="button button--secondary" type="button" onClick={() => onNavigate('transfers')}>
          Transfer money
        </button>
      </div>
    </section>
  )
}
