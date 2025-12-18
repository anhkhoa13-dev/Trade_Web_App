"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/shadcn/form";
import { Input, PasswordInput } from "../../../ui/shadcn/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../ui/shadcn/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LoginInput, loginSchema } from "@/schema/loginSchema";
import { login } from "@/actions/auth.actions";

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = async (values: LoginInput) => {
    const res = await login(values);

    if (res.status === "success") {
      router.push("/");
      router.refresh();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLogin)}
        className="space-y-3 sm:space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  className="h-10 sm:h-11"
                  {...field}
                ></Input>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  className="h-10 sm:h-11"
                  {...field}
                ></PasswordInput>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer h-10 sm:h-11 text-sm sm:text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
