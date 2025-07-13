import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface SidebarLinkProps {
  label: string
  href: string
  icon: React.ReactNode
  isActive: boolean
  onClose: () => void
}

const SidebarLink = ({
  label,
  href,
  icon,
  isActive,
  onClose,
}: SidebarLinkProps) => {
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      onClick={onClose}
      asChild
    >
      <Link
        href={href}
        className={cn(
          'w-full justify-start gap-3',
          isActive
            ? 'font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  )
}
export default SidebarLink
