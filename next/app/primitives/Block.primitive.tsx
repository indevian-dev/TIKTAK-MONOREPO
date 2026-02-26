import * as React from "react"

const variantStyles = {
    default: "rounded-app border text-app-dark-blue dark:text-white transition-all duration-300 p-4 md:p-6 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5",
    flat: "rounded-app text-app-dark-blue dark:text-white transition-all duration-300 bg-transparent bg-white dark:bg-app-dark-purple",
    elevated: "rounded-app border text-app-dark-blue dark:text-white transition-all duration-300 p-4 md:p-6 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5",
} as const

type BlockVariant = keyof typeof variantStyles

interface BlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
    variant?: BlockVariant
}

const Block = React.forwardRef<HTMLDivElement, BlockProps>(
    ({ variant = "default", ...props }, ref) => (
        <div
            ref={ref}
            className={variantStyles[variant]}
            {...props}
        />
    )
)
Block.displayName = "Block"

/* ────────────────── Sub-components ────────────────── */

const BlockHeader = React.forwardRef<
    HTMLDivElement,
    Omit<React.HTMLAttributes<HTMLDivElement>, "className">
>(({ ...props }, ref) => (
    <div
        ref={ref}
        className="flex flex-col space-y-1.5 p-6"
        {...props}
    />
))
BlockHeader.displayName = "BlockHeader"

const BlockTitle = React.forwardRef<
    HTMLParagraphElement,
    Omit<React.HTMLAttributes<HTMLHeadingElement>, "className">
>(({ ...props }, ref) => (
    <h3
        ref={ref}
        className="font-black tracking-tight text-xl leading-none"
        {...props}
    />
))
BlockTitle.displayName = "BlockTitle"

const BlockDescription = React.forwardRef<
    HTMLParagraphElement,
    Omit<React.HTMLAttributes<HTMLParagraphElement>, "className">
>(({ ...props }, ref) => (
    <p
        ref={ref}
        className="text-sm text-app-dark-blue/70 dark:text-white/70 font-medium leading-relaxed"
        {...props}
    />
))
BlockDescription.displayName = "BlockDescription"

const BlockContent = React.forwardRef<
    HTMLDivElement,
    Omit<React.HTMLAttributes<HTMLDivElement>, "className">
>(({ ...props }, ref) => (
    <div ref={ref} className="p-6 pt-0" {...props} />
))
BlockContent.displayName = "BlockContent"

const BlockFooter = React.forwardRef<
    HTMLDivElement,
    Omit<React.HTMLAttributes<HTMLDivElement>, "className">
>(({ ...props }, ref) => (
    <div
        ref={ref}
        className="flex items-center p-6 pt-0"
        {...props}
    />
))
BlockFooter.displayName = "BlockFooter"

export { Block, BlockHeader, BlockFooter, BlockTitle, BlockDescription, BlockContent }
export type { BlockProps, BlockVariant }
