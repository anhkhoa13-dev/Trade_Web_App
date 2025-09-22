import { UserService } from "@/services/userService";
import useAxiosAuth from "./useAxiosAuth";

export function useUserService() {
  const axiosAuth = useAxiosAuth();
  return UserService(axiosAuth); // secure client with interceptors
}
