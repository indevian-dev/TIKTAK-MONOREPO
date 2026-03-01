const variants = {
    full: "w-full grid grid-cols-1 gap-4 content-start px-4 md:px-6 lg:px-8",
    centered: "grid grid-cols-1 gap-4 w-full max-w-7xl mx-auto my-4 px-4 md:px-6 lg:px-8",
} as const

type SectionVariant = keyof typeof variants

function SectionPrimitive({ variant = "full", children }: { variant?: SectionVariant; children?: React.ReactNode }) {
    return <section className={variants[variant]}>{children}</section>
}

export { SectionPrimitive }
export type { SectionVariant }
