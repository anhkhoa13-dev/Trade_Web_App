import Image from 'next/image'
import React from 'react'
import NavMenu from './NavMenu'
import { menuData } from './menuData'
import Link from 'next/link'
import { ModeToggle } from '../Theme/ModeToggle'
import { Button } from '../../shadcn/button'

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-20">
            {/*Left header*/}
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        className="dark:invert"
                        src="/next.svg"
                        alt="Next.js logo"
                        width={180}
                        height={38}
                        priority
                    />
                </Link>
                <NavMenu menu={menuData} />
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href="#">Login</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="#">Sign Up</Link>
                    </Button>
                    <ModeToggle />
                </div>

            </div>
        </header>
    )
}


