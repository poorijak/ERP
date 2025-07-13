import { User } from '@prisma/client'

export type UserType = Omit<User, 'password' | 'pictureId' | 'createdAt' | 'updatedAt'>