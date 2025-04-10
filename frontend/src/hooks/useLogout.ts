import { useApiPost } from "@/hooks/useApi";
import { useCookies } from "react-cookie";

export const useLogout = () => {
  const [, , removeCookie] = useCookies([
    "access_token",
    "refresh_token",
    "uid",
  ]);

  const { mutate: logout } = useApiPost("/auth/logout", true);

  const handleLogout = () => {
    logout(null, {
      onSuccess: () => {
        removeCookie("access_token", { path: "/" });
        removeCookie("refresh_token", { path: "/" });
        removeCookie("uid", { path: "/" });
      },
    });
  };

  return { handleLogout };
};
