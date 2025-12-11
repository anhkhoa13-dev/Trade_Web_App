
import { api } from "@/backend/fetch";
import { ProfileUpdateRequest, UserProfile } from "./user.types";

export const UserService = {
    async getProfile() {
        const res = await api.get<UserProfile>({
            endpoint: "/users/profile",
        })
        return res
    },

    async updateProfile(payload: ProfileUpdateRequest) {
        const res = await api.put<UserProfile>(
            {
                endpoint: "/users/profile",
                body: payload,
            }
        )
        return res
    },
}