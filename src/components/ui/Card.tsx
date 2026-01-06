import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = true, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6',
                    hover && 'hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'
