// import { useLogin } from "@/hooks/useLogin";
import { useApiPost } from "@/hooks/useApi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCookies } from "react-cookie";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["access_token", "refresh_token", "uid"]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutate: login,
    isPending,
    isError,
    error,
  } = useApiPost("/auth/login", true);

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (response) => {
        const { access_token, refresh_token, uid } = response;

        setCookie("access_token", access_token, {
          path: "/",
          expires: new Date(Date.now() + 3600 * 1000),
        });
        setCookie("refresh_token", refresh_token, { path: "/" });
        setCookie("uid", uid, {
          path: "/",
          expires: new Date(Date.now() + 3600 * 1000),
        });

        navigate("/admin/scan");
      },
      onError: (err) => {
        console.error("Login failed:", err);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h1 className="text-2xl font-semibold text-center">Login</h1>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>

            {isError && (
              <p className="text-red-500 text-sm text-center">
                Login failed:{" "}
                {(error as any)?.message || "Something went wrong"}
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
