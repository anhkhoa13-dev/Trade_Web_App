"use server";

import { UserService } from "@/backend/user/user.services";
import { ProfileUpdateRequest } from "@/backend/user/user.types";
import { revalidatePath } from "next/cache";

export const getProfile = async () => {
  return await UserService.getProfile();
};

export const updateProfile = async (payload: ProfileUpdateRequest) => {
  const res = await UserService.updateProfile(payload);

  // Revalidate profile page to show updated data
  revalidatePath("/my/profile");

  return res;
};
