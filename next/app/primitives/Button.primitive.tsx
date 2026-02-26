import * as React from "react"
import { Link } from "@/i18n/routing"

const variantStyles = {
    default: "inline-flex items-center justify-center whitespace-nowrap rounded-app-full text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 py-2 bg-app-bright-green text-app-dark-blue hover:bg-app-bright-green/90 shadow-app-widget shadow-app/20 hover:scale-[1.02] active:scale-95",
    secondary: "inline-flex items-center justify-center whitespace-nowrap rounded-app-full text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 py-2 bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-app-dark-blue dark:text-white hover:bg-black/10 dark:hover:bg-white/10 shadow-sm active:scale-95",
    outline: "inline-flex items-center justify-center whitespace-nowrap rounded-app-full text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 py-2 border-2 border-black/10 dark:border-white/10 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 backdrop-blur-md text-app-dark-blue dark:text-white active:scale-95",
    ghost: "inline-flex items-center justify-center whitespace-nowrap rounded-app-full text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 py-2 hover:bg-black/5 dark:hover:bg-white/5 backdrop-blur-md hover:text-app-dark-blue dark:text-white text-app-dark-blue/70 dark:text-white/70",
    link: "inline-flex items-center justify-center whitespace-nowrap rounded-app-full text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 py-2 text-app-bright-green underline-offset-4 hover:underline",
    elevated: "inline-flex items-center justify-center whitespace-nowrap rounded-app-full text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-6 py-2 bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-app-dark-blue dark:text-white shadow-app-widget hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
} as const

type ButtonVariant = keyof typeof variantStyles

type ButtonProps =
    | (Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
        variant?: ButtonVariant
        isLink?: false
    })
    | (Omit<React.ComponentProps<typeof Link>, "className"> & {
        variant?: ButtonVariant
        isLink: true
    })

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    (props, ref) => {
        const { variant = "default", isLink, ...rest } = props
        const cls = variantStyles[variant]

        if (isLink) {
            const linkProps = rest as Omit<React.ComponentProps<typeof Link>, "className">
            return (
                <Link
                    className={cls}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    {...linkProps}
                />
            )
        }

        const btnProps = rest as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">
        return (
            <button
                className={cls}
                ref={ref as React.Ref<HTMLButtonElement>}
                {...btnProps}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
export type { ButtonProps, ButtonVariant }
