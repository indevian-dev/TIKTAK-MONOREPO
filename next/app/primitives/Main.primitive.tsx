import * as React from "react"

const variantStyles = {
    /** Default: simple full-width flex column (public pages, auth pages) */
    default: "w-full p-0 m-0 flex min-h-screen flex-col pb-24 bg-neutral-100 dark:bg-app-dark-purple",
    /** App: full-width <main> for workspace layouts */
    app: "w-full p-0 m-0 min-h-[calc(100vh-70px)] pb-24 bg-neutral-100 dark:bg-app-dark-purple",
} as const

type MainVariant = keyof typeof variantStyles

interface MainProps extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
    variant?: MainVariant
}

/**
 * Simple <main> wrapper with variant-based styling.
 * Layouts are responsible for constructing their own inner template.
 */
const Main = React.forwardRef<HTMLElement, MainProps>(
    ({ variant = "default", children, ...props }, ref) => (
        <main
            ref={ref}
            className={variantStyles[variant]}
            {...props}
        >
            {children}
        </main>
    )
)
Main.displayName = "Main"

export { Main }
export type { MainProps, MainVariant }
