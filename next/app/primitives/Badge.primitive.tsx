const variants = {
    default: "inline-flex items-center rounded-app-full border border-transparent bg-app-bright-green text-[#0f172b] hover:bg-app-bright-green/80 shadow-sm px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2",
    secondary: "inline-flex items-center rounded-app-full border border-transparent bg-black/5 dark:bg-white/5 backdrop-blur-md text-app-dark-blue dark:text-white hover:bg-black/10 dark:hover:bg-white/10 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2",
    destructive: "inline-flex items-center rounded-app-full border border-transparent bg-app-bright-green-danger text-white hover:bg-app-bright-green-danger/80 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2",
    outline: "inline-flex items-center rounded-app-full border border-black/10 dark:border-white/10 text-app-dark-blue dark:text-white px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-app-primary focus:ring-offset-2",
} as const

type BadgeVariant = keyof typeof variants

function BadgePrimitive({ variant = "default", children }: { variant?: BadgeVariant; children?: React.ReactNode }) {
    return <div className={variants[variant]}>{children}</div>
}

export { BadgePrimitive }
export type { BadgeVariant }
