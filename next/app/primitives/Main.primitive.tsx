const variants = {
    /** Default: simple full-width flex column (public pages, auth pages) */
    default: "w-full p-0 m-0 flex min-h-screen flex-col pb-24 bg-neutral-100 dark:bg-app-dark-purple",
    /** App: full-width <main> for workspace layouts */
    app: "w-full p-0 m-0 min-h-[calc(100vh-70px)] pb-24 bg-neutral-100 dark:bg-app-dark-purple",
} as const

type MainVariant = keyof typeof variants

function MainPrimitive({ variant = "default", children }: { variant?: MainVariant; children?: React.ReactNode }) {
    return <main className={variants[variant]}>{children}</main>
}

export { MainPrimitive }
export type { MainVariant }
