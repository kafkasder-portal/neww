import { cn } from '@/lib/utils'
import React from 'react'
import { Button } from './button'
import { CorporateButton } from '@/components/ui/corporate/CorporateComponents'

interface ButtonEnhancedProps extends React.ComponentProps<typeof Button> {
    loading?: boolean
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
}

export const ButtonEnhanced = React.forwardRef<
    HTMLButtonElement,
    ButtonEnhancedProps
>(({ loading, icon, iconPosition = 'left', children, className, disabled, ...props }, ref) => {
    return (
        <CorporateButton
            ref={ref}
            className={cn(className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            )}
            {!loading && icon && iconPosition === 'left' && (
                <span className="mr-2">{icon}</span>
            )}
            {children}
            {!loading && icon && iconPosition === 'right' && (
                <span className="ml-2">{icon}</span>
            )}
        </CorporateButton>
    )
})

ButtonEnhanced.displayName = 'ButtonEnhanced'

export default ButtonEnhanced
