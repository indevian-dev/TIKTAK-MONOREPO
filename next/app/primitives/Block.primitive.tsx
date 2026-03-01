"use client"

import { useEffect } from "react"

const variants = {
    default: "rounded-app border text-app-dark-blue dark:text-white transition-all duration-300 p-4 md:p-6 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5",
    flat: "rounded-app text-app-dark-blue dark:text-white transition-all duration-300 bg-transparent bg-white dark:bg-app-dark-purple",
    elevated: "rounded-app border text-app-dark-blue dark:text-white transition-all duration-300 p-4 md:p-6 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5",
    modal: "fixed inset-0 z-50 h-screen overflow-y-auto overscroll-contain grid grid-cols-1 justify-center items-center bg-white dark:bg-app-dark-purple px-4 md:px-24 lg:px-48 py-24 animate-in fade-in zoom-in duration-200",
} as const

type BlockVariant = keyof typeof variants

function BlockPrimitive({ variant = "default", children }: { variant?: BlockVariant; children?: React.ReactNode }) {
    useEffect(() => {
        if (variant !== "modal") return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prevOverflow; };
    }, [variant]);

    return <div className={variants[variant]}>{children}</div>
}

function BlockHeader({ children }: { children?: React.ReactNode }) {
    return <div className="flex flex-col space-y-1.5 p-6">{children}</div>
}

function BlockTitle({ children }: { children?: React.ReactNode }) {
    return <h3 className="font-black tracking-tight text-xl leading-none">{children}</h3>
}

function BlockDescription({ children }: { children?: React.ReactNode }) {
    return <p className="text-sm text-app-dark-blue/70 dark:text-white/70 font-medium leading-relaxed">{children}</p>
}

function BlockContent({ children }: { children?: React.ReactNode }) {
    return <div className="p-6 pt-0">{children}</div>
}

function BlockFooter({ children }: { children?: React.ReactNode }) {
    return <div className="flex items-center p-6 pt-0">{children}</div>
}

export { BlockPrimitive, BlockHeader, BlockFooter, BlockTitle, BlockDescription, BlockContent }
export type { BlockVariant }
