import { signupSchema, signinSchema } from '@/features/auths/schemas/auths'
import { db } from '@/lib/db'
import { genSalt, hash, compare } from 'bcrypt'
import { SignJWT } from 'jose'
import { cookies, headers } from 'next/headers'
import { getUserById } from '@/features/users/db/users'
import { revalidateUserCache } from '@/features/users/db/cache'

interface SignupInput {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface SigninInput {
  email: string
  password: string
}

const generateJwtToken = async (userId: string) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt() // iat: ms
    .setExpirationTime('30d')
    .sign(secret)
}

const setCookieToken = async (token: string) => {
  const cookie = await cookies()
  cookie.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })
}

export const signup = async (input: SignupInput) => {
  try {
    const { success, data, error } = signupSchema.safeParse(input)

    if (!success) {
      return {
        message: 'กรุณากรอกข้อมูลให้ถูกต้อง',
        error: error.flatten().fieldErrors
      }
    }

    const user = await db.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (user) {
      return {
        message: 'อีเมลนี้มีผู้ใช้งานแล้ว'
      }
    }

    const salt = await genSalt(10)
    const hashedPassword = await hash(data.password, salt)

    const newUser = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword
      }
    })

    const token = await generateJwtToken(newUser.id)
    await setCookieToken(token)

    revalidateUserCache(newUser.id)

  } catch (error) {
    console.error('Error sign up user:', error)
    return {
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
    }
  }
}

export const signin = async (input: SigninInput) => {
  try {
    const { success, data, error } = signinSchema.safeParse(input)
    if (!success) {
      return {
        message: 'กรุณากรอกข้อมูลให้ถูกต้อง',
        error: error.flatten().fieldErrors
      }
    }

    const user = await db.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (!user) {
      return {
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      }
    }

    if (user.status !== 'Active') {
      return {
        message: 'บัญชีของคุณไม่พร้อมใช้งาน'
      }
    }

    const isValidPassword = await compare(data.password, user.password)

    if (!isValidPassword) {
      return {
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      }
    }

    const token = await generateJwtToken(user.id)
    await setCookieToken(token)
  } catch (error) {
    console.error('Error sign in user:', error)
    return {
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    }
  }
}

export const authCheck = async () => {
  const userId = (await headers()).get('x-user-id')
  return userId ? await getUserById(userId) : null
}

export const signout = async () => {
  try {
    (await cookies()).delete('token')
  } catch (error) {
    console.error('Error sign out user:', error)
    return { message: 'เกิดข้อผิดพลาดในการออกจากระบบ' }
  }
}