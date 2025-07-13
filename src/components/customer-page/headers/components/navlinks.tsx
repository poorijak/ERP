import { SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const NAV_LINKS = [
  { title: 'หน้าหลัก', href: '/' },
  { title: 'สินค้าทั้งหมด', href: '/products' },
  { title: 'เกี่ยวกับ', href: '/about' },
  { title: 'ติดต่อเรา', href: '/contact' },
]

export const MobileNavLinks = () => (
  <div className='flex flex-col gap-2'>
    {NAV_LINKS.map((link, index) => (
      <SheetClose
        key={index}
        asChild
      >
        <Button
          variant='secondary'
          size='lg'
          asChild
        >
          <Link href={link.href}>{link.title}</Link>
        </Button>
      </SheetClose>
    ))}
  </div>
)

export const DesktopNavLinks = () => (
  <div className='flex items-center gap-1'>
    {NAV_LINKS.map((link, index) => (
      <Button
        key={index}
        variant='ghost'
        size='sm'
        asChild
      >
        <Link href={link.href}>{link.title}</Link>
      </Button>
    ))}
  </div>
)
