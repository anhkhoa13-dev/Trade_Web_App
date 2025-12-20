"use client";

import { useEffect, useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Search, Loader2 } from "lucide-react";
import { searchCoins } from "@/actions/gecko.actions";
import { Coin } from "@/entities/Coin/Coin";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/app/ui/shadcn/command";

interface SearchCommandProps {
    initial: Coin[];
}

export default function SearchCommand({ initial }: SearchCommandProps) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [cryptos, setCryptos] = useState<Coin[]>(initial);
    const [shortcut, setShortcut] = useState("Ctrl K");

    const isSearchMode = !!searchTerm.trim();
    const displayList = isSearchMode ? cryptos : initial.slice(0, 10);

    // Keyboard shortcut handler
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Detect OS for shortcut display
    useEffect(() => {
        const isMac =
            typeof window !== "undefined" &&
            window.navigator.platform.toUpperCase().includes("MAC");

        setShortcut(isMac ? "⌘K" : "Ctrl K");
    }, []);

    const handleSearch = useDebouncedCallback(async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) {
            setCryptos(initial);
            return;
        }

        setLoading(true);
        try {
            const results = await searchCoins(trimmed);
            setCryptos(results);
        } catch {
            setCryptos([]);
        } finally {
            setLoading(false);
        }
    }, 400);

    const handleSelectCrypto = useCallback(
        (coin: Coin) => {
            router.push(`/trade/${coin.symbol.toUpperCase()}`);
            setOpen(false);
            setSearchTerm("");
            setCryptos(initial);
        },
        [router, initial]
    );

    // Reset state when dialog closes
    const handleOpenChange = useCallback(
        (isOpen: boolean) => {
            setOpen(isOpen);
            if (!isOpen) {
                setSearchTerm("");
                setCryptos(initial);
            }
        },
        [initial]
    );

    return (
        <>
            {/* Search Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-[240px]"
            >
                <Search className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">Search crypto...</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                    {shortcut}
                </kbd>
            </button>

            {/* Command Dialog */}
            <CommandDialog open={open} onOpenChange={handleOpenChange}>
                <CommandInput
                    placeholder="Search by name or symbol..."
                    value={searchTerm}
                    onValueChange={(v) => {
                        setSearchTerm(v);
                        handleSearch(v);
                    }}
                />

                <CommandList className="max-h-[300px]">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Searching...</span>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && displayList.length === 0 && (
                        <CommandEmpty>No cryptocurrencies found.</CommandEmpty>
                    )}

                    {/* Results */}
                    {!loading && displayList.length > 0 && (
                        <CommandGroup heading={isSearchMode ? "Search Results" : "Popular"}>
                            {displayList.map((coin) => (
                                <CommandItem
                                    key={coin.id}
                                    value={`${coin.name} ${coin.symbol}`}
                                    onSelect={() => handleSelectCrypto(coin)}
                                    className="flex items-center gap-3 px-3 py-2.5"
                                >
                                    <Image
                                        src={coin.image}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                        alt={coin.name}
                                        unoptimized
                                    />

                                    <div className="flex flex-1 flex-col min-w-0">
                                        <span className="font-medium truncate">{coin.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {coin.symbol.toUpperCase()}
                                        </span>
                                    </div>

                                    {coin.market_cap_rank && (
                                        <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                            #{coin.market_cap_rank}
                                        </span>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
