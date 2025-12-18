"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../ui/shadcn/card";
import LoginForm from "./LoginForm";
import { Separator } from "../../../ui/shadcn/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleButton, GithubButton } from "./OAuth2Button";
import { googleLogin } from "@/actions/auth.actions";
import toast from "react-hot-toast";

export default function LoginCard() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    await googleLogin();
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          layout
        >
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-center text-xl sm:text-2xl font-bold">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
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
              <GoogleButton onClick={handleGoogleLogin} />
              <GithubButton onClick={() => {}} />
            </div>
          </CardContent>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
