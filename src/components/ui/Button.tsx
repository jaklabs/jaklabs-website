import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300',
                    {
                        'bg-primary text-white hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25':
                            variant === 'primary',
                        'bg-transparent border border-white/20 text-white hover:bg-white/10':
                            variant === 'secondary',
                        'bg-transparent text-white/80 hover:text-white': variant === 'ghost',
                    },
                    {
                        'px-4 py-2 text-sm': size === 'sm',
                        'px-6 py-3 text-base': size === 'md',
                        'px-8 py-4 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'
