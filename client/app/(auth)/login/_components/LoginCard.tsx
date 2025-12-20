import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../ui/shadcn/card";
import LoginForm from "./LoginForm";
import { Separator } from "../../../ui/shadcn/separator";
import Link from "next/link";
import { GoogleButton, GithubButton } from "./OAuth2Button";

export default function LoginCard() {

  return (
    <Card >
      <CardHeader >
        <CardTitle className="text-center text-xl sm:text-2xl font-bold">
          Welcome Back
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-foreground hover:underline"
          >
            Sign up
          </Link>
        </p>
        <div className="my-3 sm:my-4 flex items-center">
          <Separator className="flex-1 border-t" />
          <span className="px-2 bg-card text-xs sm:text-sm text-muted-foreground">
            or continue with
          </span>
          <Separator className="flex-1 border-t border-dashed" />
        </div>

        <div className="flex justify-center gap-3 sm:gap-4 mt-2 sm:mt-3">
          <GoogleButton />
          <GithubButton />
        </div>
      </CardContent>
    </Card>
  );
}
