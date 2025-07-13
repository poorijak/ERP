import AuthHeader from '@/features/auths/components/auth-header'
import AuthForm from '@/features/auths/components/auth-form'

const SigninPage = () => {
  const type = 'signin'

  return (
    <AuthHeader type={type}>
      <AuthForm type={type} />
    </AuthHeader>
  )
}
export default SigninPage
