import Link from 'next/link'

interface AuthFooterProps {
  type: 'signup' | 'signin'
}

const authTextMap = {
  signup: {
    footerText: 'มีบัญชีอยู่แล้ว?',
    linkText: 'เข้าสู่ระบบ',
    linkHref: '/auth/signin',
  },
  signin: {
    footerText: 'ยังไม่มีบัญชี',
    linkText: 'สมัครสมาชิก',
    linkHref: '/auth/signup',
  },
}

const AuthFooter = ({ type }: AuthFooterProps) => {
  const { footerText, linkText, linkHref } = authTextMap[type]

  return (
    <div>
      <p className='text-accent-foreground'>
        {footerText}{' '}
        <Link
          href={linkHref}
          className='text-primary hover:underline'
        >
          {linkText}
        </Link>
      </p>
    </div>
  )
}
export default AuthFooter
