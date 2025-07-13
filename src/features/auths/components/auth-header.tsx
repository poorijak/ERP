import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

interface AuthHeaderProps {
  type: 'signup' | 'signin'
  children: React.ReactNode
}

const AuthHeader = ({ type, children }: AuthHeaderProps) => {
  const title = type === 'signup' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'
  const desc =
    type === 'signup'
      ? 'กรุณากรอกข้อมูลเพื่อสมัครสมาชิก'
      : 'กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ'

  return (
    <div className='px-4 md:px-0'>
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            {title}
          </CardTitle>
          <CardDescription className='text-center'>{desc}</CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  )
}
export default AuthHeader
