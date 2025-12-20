"use client"

import { AnimatePresence, motion } from "framer-motion"

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="w-full max-w-sm mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}