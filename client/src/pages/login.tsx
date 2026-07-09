import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lock, User, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      setLocation("/admin");
    }
  }, [user, setLocation]);

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-16">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-foreground hover:bg-white/5 p-0 h-auto font-normal text-body"
            data-testid="button-back-to-tour"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to tour
          </Button>
        </div>
        
        <div className="mb-12">
          <h1 className="text-display mb-4">Admin access</h1>
          <p className="text-body text-muted-foreground">Sign in to manage lab products and settings</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-small text-muted-foreground">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter username"
                        className="pl-12 h-14 text-body bg-card border-border rounded-sm"
                        data-testid="input-username"
                      />
                    </div>
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
                  <FormLabel className="text-small text-muted-foreground">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter password"
                        className="pl-12 h-14 text-body bg-card border-border rounded-sm"
                        data-testid="input-password"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-14 text-body rounded-sm mt-4"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? "Authenticating..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
