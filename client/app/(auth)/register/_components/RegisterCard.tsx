"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../ui/shadcn/card";
import RegisterForm from "./RegisterForm";

export default function RegisterCard() {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
        <CardTitle className="text-center text-xl sm:text-2xl font-bold">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <RegisterForm />

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:underline">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
