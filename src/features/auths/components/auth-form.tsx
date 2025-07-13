'use client'

import InputForm from '@/components/shared/input-form'
import SubmitBtn from '@/components/shared/submit-btn'
import { CardContent, CardFooter } from '@/components/ui/card'
import Form from 'next/form'
import AuthFooter from './auth-footer'
import { useForm } from '@/hooks/use-form'
import { authAction } from '../actions/auths'
import ErrorMessage from '@/components/shared/error-message'

interface AuthFormProps {
  type: 'signup' | 'signin'
}

const AuthForm = ({ type }: AuthFormProps) => {
  const renderInput = (
    label: string,
    id: string,
    type = 'text',
    required = false
  ) => (
    <div className='flex flex-col gap-2'>
      <InputForm
        label={label}
        id={id}
        type={type}
        required={required}
      />
      {errors[id] && <ErrorMessage error={errors[id][0]} />}
    </div>
  )

  const { errors, formAction, isPending, clearErrors } = useForm(
    authAction,
    '/'
  )

  return (
    <Form
      action={formAction}
      onChange={clearErrors}
    >
      <CardContent className='flex flex-col gap-3'>
        {type === 'signup' && renderInput('ชื่อผู้ใช้', 'name')}
        {renderInput('อีเมล', 'email', 'email', true)}
        {renderInput('รหัสผ่าน', 'password', 'password', true)}
        {type === 'signup' &&
          renderInput('ยืนยันรหัสผ่าน', 'confirmPassword', 'password', true)}
      </CardContent>
      <CardFooter className='pt-4 flex flex-col gap-2'>
        <AuthFooter type={type} />
        <SubmitBtn
          name={type === 'signup' ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          className='w-full'
          pending={isPending}
        />
      </CardFooter>
    </Form>
  )
}
export default AuthForm
