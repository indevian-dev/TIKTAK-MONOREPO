interface SectionTitleProps {
    title: React.ReactNode
    description?: React.ReactNode
    action?: React.ReactNode
    icon?: React.ReactNode
}

function SectionTitlePrimitive({ title, description, action, icon }: SectionTitleProps) {
    return (
        <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-app bg-app-bright-green/10 dark:bg-app-bright-green/10 mb-1">
                    {icon && (
                        <span className="text-app-bright-green text-lg leading-none shrink-0">
                            {icon}
                        </span>
                    )}
                    <h2 className="text-base font-bold tracking-tight text-app-dark-blue dark:text-white truncate">
                        {title}
                    </h2>
                </div>
                {description && (
                    <p className="text-sm text-app-dark-blue/50 dark:text-white/50 mt-1 pl-1">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <div className="shrink-0 flex items-center gap-2">
                    {action}
                </div>
            )}
        </div>
    )
}

export { SectionTitlePrimitive }
export type { SectionTitleProps }
