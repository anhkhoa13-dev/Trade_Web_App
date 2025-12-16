import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import React from 'react'

export default function SortableHeader({
    label,
    columnId,
    direction,
    onSort
}: {
    label: string;
    columnId: string;
    direction: "asc" | "desc" | null;
    onSort: (id: string) => void
}) {
    return (
        <button
            onClick={() => onSort(columnId)}
            className={`flex items-center gap-1 transition-colors hover:text-primary ${direction ? "text-primary font-bold" : ""
                }`}
        >
            {label}
            {direction === "asc" && <ArrowUp className="h-4 w-4" />}
            {direction === "desc" && <ArrowDown className="h-4 w-4" />}
            {!direction && <ArrowUpDown className="h-4 w-4 opacity-30" />}
        </button>
    );
};



