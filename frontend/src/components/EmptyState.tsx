type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3 className="heading-3">{title}</h3>
      <p className="body-text">{description}</p>
    </div>
  )
}
