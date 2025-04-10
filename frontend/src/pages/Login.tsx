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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import sariSariLogo from "@/assets/sari_sari_main_logo.svg";
import { useCookies } from "react-cookie";
import { toast, Toaster } from "sonner";

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
    mode: "onSubmit",
  });

  const { mutate: login, isPending } = useApiPost("/auth/login", true);

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

        // Set a flag in sessionStorage to show toast in the next component
        sessionStorage.setItem("showLoginSuccessToast", "true");

        // Navigate immediately
        navigate("/admin/scan");
      },
      onError: (err) => {
        console.error("Login failed:", err);

        // Check if the error is related to invalid credentials
        const errorMessage = (err as any)?.message?.toLowerCase() || "";
        const errorStatus = (err as any)?.status || (err as any)?.statusCode;

        // Check for common authentication error patterns (401 status or specific error messages)
        if (
          errorStatus === 401 ||
          errorMessage.includes("invalid") ||
          errorMessage.includes("incorrect") ||
          errorMessage.includes("wrong") ||
          errorMessage.includes("not found") ||
          errorMessage.includes("unauthorized")
        ) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    });
  };

  const handleFormSubmit = form.handleSubmit(onSubmit, (errors) => {
    // For form validation errors, use the specific message logic
    if (errors.email || errors.password) {
      toast.error("Invalid email or password. Please try again.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  });

  return (
    <>
      <Toaster position="top-center" richColors expand={true} duration={3000} />
      <div className="h-dvh flex flex-col items-center justify-center px-4 font-inter">
        <img
          src={sariSariLogo}
          className="w-12 h-10 mx-auto mb-5"
          alt="Sari Sari Logo"
        />
        <div className="w-full max-w-md mx-auto">
          <Form {...form}>
            <form
              onSubmit={handleFormSubmit}
              className="space-y-6 w-11/12 mx-auto sm:w-full"
            >
              <h1 className="font-inter text-2xl lg:text-3xl font-bold text-center">
                Admin Login
              </h1>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Email</FormLabel>
                    <FormControl className="py-6">
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Password</FormLabel>
                    <FormControl className="py-6">
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full py-6 mt-10"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
