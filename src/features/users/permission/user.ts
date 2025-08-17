import { UserType } from "@/types/user"

export const canUpdateUser = (user : UserType) => {
    return user.status === "Active"
}