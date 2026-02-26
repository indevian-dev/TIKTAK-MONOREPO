import * as React from "react"

const variantStyles = {
    full: "w-full grid grid-cols-1 gap-4 content-start px-4 md:px-6 lg:px-8",
    centered: "grid grid-cols-1 gap-4 w-full max-w-7xl mx-auto my-4 px-4 md:px-6 lg:px-8",
} as const

type SectionVariant = keyof typeof variantStyles

interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
    variant?: SectionVariant
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ variant = "full", ...props }, ref) => (
        <section
            ref={ref}
            className={variantStyles[variant]}
            {...props}
        />
    )
)
Section.displayName = "Section"

export { Section }
export type { SectionProps, SectionVariant }
