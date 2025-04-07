import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

type LoginPayload = {
  email: string;
  password: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
  });
};
