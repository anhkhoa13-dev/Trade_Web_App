"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/shadcn/form";
import { Input, PasswordInput } from "../../../ui/shadcn/input";
import { Button } from "../../../ui/shadcn/button";
import { RegisterInput, registerSchema } from "@/schema/registerSchema";
import { register } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Spinner } from "@/app/ui/shadcn/spinner";

export default function RegisterForm() {
  const router = useRouter()

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm: "",
    },
  })

  const { isSubmitting } = form.formState

  const handleRegister = async (values: RegisterInput) => {
    const res = await register(values)

    if (res.status === "success") {
      toast.success(res.message)

      const params = new URLSearchParams();
      if (res.data?.urlToken) {
        params.set("token", res.data.urlToken);
      }

      params.set("email", values.email)
      router.push(`/verify?${params.toString()}`)

    } else {
      toast.error(res.message)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johnPaul123" {...field}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <PasswordInput {...field}></PasswordInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <PasswordInput {...field}></PasswordInput>
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
          {isSubmitting ? (
            <Spinner />
          ) :
            "Register"
          }
        </Button>
      </form>
    </Form>
  );
}
