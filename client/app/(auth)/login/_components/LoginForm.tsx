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
    const res = await login(values)

    if (res.status === "success") {
      router.push("/");
      router.refresh();
      toast.success(res.message);
    } else {
      toast.error(res.message)
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
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  {...field}
                ></Input>
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
                <PasswordInput
                  placeholder="••••••••"
                  {...field}
                ></PasswordInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
