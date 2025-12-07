"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@/hooks/useSignUp";
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

export default function RegisterForm() {
  const registerMutation = useSignUp();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const handleRegister = async (values: RegisterInput) => {
    registerMutation.mutate(values);
  };
  const { isPending } = registerMutation;

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
          disabled={isPending}
        >
          {isPending ? "Processing..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}
