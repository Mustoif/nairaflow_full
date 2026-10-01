type NavigationItemProps = {
  label: string
  href: string
  isActive?: boolean
  onClick?: () => void
}

export function NavigationItem({
  label,
  href,
  isActive = false,
  onClick,
}: NavigationItemProps) {
  return (
    <a
      className={`navigation-item${isActive ? ' navigation-item--active' : ''}`}
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
    >
      {label}
    </a>
  )
}
