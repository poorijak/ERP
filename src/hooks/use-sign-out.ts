import { useTransition } from 'react'
import { signoutAction } from '@/features/auths/actions/auths'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useSignout = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSignout = () => {
    startTransition(async () => {
      const result = await signoutAction()
      if (result.success) {
        toast.success(result.message)
        router.push('/auth/signin')
      } else {
        toast.error(result.message)
      }
    })
  }

  return { isPending, handleSignout }
}