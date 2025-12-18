import React from "react";
import { cn } from "@/lib/utils";
import { copyright, legalLinks } from "./footerData";
import Link from "next/link";

export default function Copyright({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                `text-muted-foreground mt-8 flex flex-col justify-between gap-4
        border-t py-8 text-xs font-medium md:flex-row md:items-center
        md:text-left`,
                className,
            )}
        >
            <p className="order-2 lg:order-1">{copyright}</p>
            <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
                {legalLinks.map((link, idx) => (
                    <li key={idx} className="hover:text-primary">
                        <Link href={link.href}>{link.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
