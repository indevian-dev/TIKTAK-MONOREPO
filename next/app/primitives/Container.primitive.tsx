const variants = {
    full: "mx-auto w-full max-w-full transition-all duration-300",
    centered: "mx-auto w-full max-w-7xl p-4 px-4 md:px-6 lg:px-8 transition-all duration-300 flex items-start h-full gap-4",
    nav: "mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 transition-all duration-300 flex items-center h-16 flex justify-between",
} as const

type ContainerVariant = keyof typeof variants

function ContainerPrimitive({ variant = "full", children }: { variant?: ContainerVariant; children?: React.ReactNode }) {
    return <div className={variants[variant]}>{children}</div>
}

export { ContainerPrimitive }
export type { ContainerVariant }
