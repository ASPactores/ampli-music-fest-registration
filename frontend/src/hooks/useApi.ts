import { AxiosError, AxiosRequestConfig } from "axios";
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import api from "@/lib/axios";

// Define types
type ApiMethod = "get" | "post" | "put" | "delete";

interface ApiOptions {
  url: string;
  method: ApiMethod;
  data?: any;
  authorized?: boolean;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  uid: string;
}

// Custom hook for handling API requests with auth
export function useApiRequest<TData = any, TError = AxiosError>(
  options: ApiOptions,
  queryOptions?: UseQueryOptions<TData, TError>
) {
  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
    "uid",
  ]);
  const navigate = useNavigate();

  // Function to logout the user
  const handleLogout = () => {
    removeCookie("access_token");
    removeCookie("refresh_token");
    removeCookie("uid");
    navigate("/login");
  };

  // Function to perform API request with token refresh logic
  const performApiRequest = async (): Promise<TData> => {
    try {
      const config: AxiosRequestConfig = {
        method: options.method,
        url: options.url,
        data: options.data,
      };

      if (options.authorized && cookies.access_token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${cookies.access_token}`,
        };
      }

      const response = await api(config);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      // Handle 401 error - expired token
      if (axiosError.response?.status === 401 && cookies.refresh_token) {
        try {
          const refreshResponse = await api.post<RefreshTokenResponse>(
            "/auth/refresh-token",
            {
              refresh_token: cookies.refresh_token,
            }
          );

          const newAccessToken = refreshResponse.data.access_token;
          const newRefreshToken = refreshResponse.data.refresh_token;
          const uid = refreshResponse.data.uid;

          setCookie("access_token", newAccessToken, { path: "/" });
          setCookie("refresh_token", newRefreshToken, { path: "/" });
          setCookie("uid", uid, { path: "/" });

          // Retry original request with new token
          const retryConfig: AxiosRequestConfig = {
            method: options.method,
            url: options.url,
            data: options.data,
            headers: {
              ...(options.authorized && cookies.access_token
                ? { Authorization: `Bearer ${newAccessToken}` }
                : {}),
            },
          };

          const retryResponse = await api(retryConfig);
          return retryResponse.data;
        } catch (refreshError) {
          const refreshAxiosError = refreshError as AxiosError;

          // If refresh token is invalid or expired, logout
          if (
            refreshAxiosError.response?.status === 400 ||
            refreshAxiosError.response?.status === 401
          ) {
            handleLogout();
          }
          throw refreshError;
        }
      }
      throw error;
    }
  };

  if (options.method === "get") {
    return useQuery<TData, TError>({
      queryKey: [options.url, options.data],
      queryFn: performApiRequest,
      ...queryOptions,
    });
  }

  // Use React Query's useMutation for other methods (POST, PUT, DELETE)
  return useMutation<TData, TError, any>({
    mutationFn: performApiRequest,
    ...(queryOptions as UseMutationOptions<TData, TError, any>),
  });
}

// Helper hooks for specific HTTP methods
export function useApiGet<TData = any, TError = AxiosError>(
  url: string,
  authorized = false,
  queryOptions?: UseQueryOptions<TData, TError>
) {
  return useApiRequest<TData, TError>(
    { method: "get", url, authorized },
    queryOptions
  );
}

export function useApiPost<TData = any, TError = AxiosError>(
  url: string,
  authorized = false,
  mutationOptions?: UseMutationOptions<TData, TError, any>
) {
  const [cookies] = useCookies(["access_token"]);

  const performApiRequest = async (data: any) => {
    const config: AxiosRequestConfig = {
      method: "post",
      url,
      data,
    };

    if (authorized && cookies.access_token) {
      config.headers = {
        Authorization: `Bearer ${cookies.access_token}`,
      };
    }

    const response = await api(config);
    return response.data;
  };

  return useMutation<TData, TError, any>({
    mutationFn: performApiRequest,
    ...mutationOptions,
  });
}

export function useApiPut<TData = any, TError = AxiosError>(
  url: string,
  authorized = false,
  mutationOptions?: UseMutationOptions<TData, TError, any>
) {
  const [cookies] = useCookies(["access_token"]);

  const performApiRequest = async (data: any) => {
    const config: AxiosRequestConfig = {
      method: "put",
      url,
      data,
    };

    if (authorized) {
      if (cookies.access_token) {
        config.headers = {
          Authorization: `Bearer ${cookies.access_token}`,
        };
      }
    }

    const response = await api(config);
    return response.data;
  };

  return useMutation<TData, TError, any>({
    mutationFn: performApiRequest,
    ...mutationOptions,
  });
}

export function useApiDelete<TData = any, TError = AxiosError>(
  url: string,
  authorized = false,
  mutationOptions?: UseMutationOptions<TData, TError, any>
) {
  const performApiRequest = async (data?: any) => {
    const config: AxiosRequestConfig = {
      method: "delete",
      url,
      data,
    };

    if (authorized) {
      const [cookies] = useCookies(["access_token"]);
      if (cookies.access_token) {
        config.headers = {
          Authorization: `Bearer ${cookies.access_token}`,
        };
      }
    }

    const response = await api(config);
    return response.data;
  };

  return useMutation<TData, TError, any>({
    mutationFn: performApiRequest,
    ...mutationOptions,
  });
}
