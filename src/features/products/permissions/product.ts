import { UserType } from "@/types/user";

export const canCreateProduct = (user : UserType) => {
    return user.role === 'Admin'
}

export const canUpdateProduct = (user : UserType) => {
    return user.role === 'Admin'
}