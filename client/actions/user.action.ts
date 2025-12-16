"use server"

import { UserService } from "@/backend/user/user.services";

export const getProfile = async () => {
    return await UserService.getProfile()
}

