import { auth } from "@/auth"
import { redirect } from "next/navigation"
import React from "react"

export default async function Authlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  if (session) redirect("/")

  return (
    <main>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        {children}
      </div>
    </main>
  );
}
