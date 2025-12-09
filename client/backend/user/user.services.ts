
import { api } from "@/backend/fetch";
import { ProfileUpdateRequest, UserProfile } from "./user.types";

export const UserService = {
    async getProfile() {
        const res = await api.get<UserProfile>(
            "/users/profile"
        )
        return res
    },

    async updateProfile(payload: ProfileUpdateRequest) {
        const res = await api.put<UserProfile>(
            "/users/profile",
            payload,
        );
        return res;
    },
}