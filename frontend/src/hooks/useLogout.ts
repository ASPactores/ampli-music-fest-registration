import api from "@/lib/axios";

export const useLogout = () => {
  return api.get("/auth/logout", {
    withCredentials: true,
  });
};
