import { UserType } from "@/types/user";

export const canUpdateUserCart = (user : UserType) => {
    return user.status === 'Active';
}