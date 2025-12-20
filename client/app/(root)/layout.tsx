import React from 'react'
import { auth } from "@/auth"
import Header from './_components/Header/Header'
import Footer from './_components/Footer/Footer'

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const user = session?.user;

    return (
        <main className="flex-1">
            <Header user={user} />

            <div className="container mx-auto pb-10 px-3">
                {children}
            </div>
            <Footer />
        </main>
    )
}