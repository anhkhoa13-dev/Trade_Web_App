import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 40;

export function useHeaderScroll() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
        };

        const scrollListener = { passive: true };
        window.addEventListener("scroll", handleScroll, scrollListener);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return isScrolled;
}

interface HeaderStylesProps {
    isScrolled: boolean;
}

export function getHeaderStyles({ isScrolled }: HeaderStylesProps) {
    return cn(
        "sticky top-0 z-50 w-full",
        "transition-all duration-300 ease-in-out",
        isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-transparent border-b border-transparent"
    );
}
