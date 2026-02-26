import * as React from "react"

const variantStyles = {
    full: "mx-auto w-full max-w-full transition-all duration-300",
    centered: "mx-auto w-full max-w-7xl p-4 px-4 md:px-6 lg:px-8 transition-all duration-300 flex items-start h-full gap-4",
    nav: "mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 transition-all duration-300 flex items-center h-16 flex justify-between",
} as const

type ContainerVariant = keyof typeof variantStyles

interface ContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
    variant?: ContainerVariant
}

/**
 * Centered container that constrains max-width and provides standard padding.
 * variant="7xl-sidebar" adds flex layout for sidebar + content columns.
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ variant = "full", ...props }, ref) => (
        <div
            ref={ref}
            className={variantStyles[variant]}
            {...props}
        />
    )
)
Container.displayName = "Container"

export { Container }
export type { ContainerProps, ContainerVariant }
