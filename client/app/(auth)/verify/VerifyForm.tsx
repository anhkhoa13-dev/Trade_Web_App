"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../ui/shadcn/form";
import { Input } from "../../ui/shadcn/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/shadcn/button";
import {
  VerificationInput,
  verificationSchema,
} from "@/schema/verificationSchema";
import { activate } from "@/actions/auth.actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function VerifyForm({ urlToken }: { urlToken: string }) {
  const router = useRouter();
  const form = useForm<VerificationInput>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      activateCode: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleVerify = async (params: VerificationInput) => {
    const res = await activate({ urlToken, params });

    if (res.status === "success") {
      toast.success(res.message);
      router.push(`/login`);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleVerify)}
        className="space-y-3 sm:space-y-4"
      >
        <FormField
          control={form.control}
          name="activateCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs sm:text-sm">
                Verification Code
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="123456"
                  maxLength={6}
                  className="h-10 sm:h-11 text-center text-lg tracking-widest"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-10 sm:h-11 text-sm sm:text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify Account"}
        </Button>
      </form>
    </Form>
  );
}
