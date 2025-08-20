import { ReactNode } from 'react'

/*
 * EmptyState Component - Consistent empty states across the application
 * 
 * WHY: Boş durumlar için tutarlı ve anlamlı kullanıcı deneyimi
 * HOW: İkon, mesaj ve CTA button ile kullanıcıyı yönlendirme
 */

export interface EmptyStateProps {
    icon?: ReactNode
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
        variant?: 'default' | 'outline'
        icon?: ReactNode
    }
    illustration?: ReactNode
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    illustration,
    className = '',
    size = 'md'
}: EmptyStateProps) {
    const sizeClasses = {
        sm: {
            container: 'py-8',
            icon: 'w-8 h-8',
            title: 'text-lg',
            description: 'text-sm'
        },
        md: {
            container: 'py-12',
            icon: 'w-12 h-12',
            title: 'text-xl',
            description: 'text-base'
        },
        lg: {
            container: 'py-16',
            icon: 'w-16 h-16',
            title: 'text-2xl',
            description: 'text-lg'
        }
    }

    const sizes = sizeClasses[size]

    return (
        <div className={`flex flex-col items-center justify-center text-center ${sizes.container} ${className}`}>
            {/* Illustration or Icon */}
            <div className="mb-4">
                {illustration ? (
                    <div className="mb-2">
                        {illustration}
                    </div>
                ) : icon ? (
                    <div className={`${sizes.icon} text-ink-3 mx-auto mb-2`}>
                        {icon}
                    </div>
                ) : null}
            </div>

            {/* Content */}
            <div className="max-w-md space-y-2">
                <h3 className={`font-semibold text-ink-1 ${sizes.title}`}>
                    {title}
                </h3>

                {description && (
                    <p className={`text-ink-3 ${sizes.description} leading-relaxed`}>
                        {description}
                    </p>
                )}
            </div>

            {/* Action Button */}
            {action && (
                <div className="mt-6">
                    <EmptyStateAction {...action} />
                </div>
            )}
        </div>
    )
}

// Action Button Component
interface EmptyStateActionProps {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline'
    icon?: ReactNode
}

function EmptyStateAction({
    label,
    onClick,
    variant = 'default',
    icon
}: EmptyStateActionProps) {
    const baseClasses = [
        'inline-flex items-center justify-center gap-2',
        'px-6 py-3 text-sm font-medium rounded-md',
        'transition-all duration-fast ease-out',
        'focus-ring'
    ].join(' ')

    const variantClasses = {
        default: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
        outline: 'border border-border bg-surface hover:bg-muted text-ink-2'
    }

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {icon && <span className="w-4 h-4">{icon}</span>}
            <span>{label}</span>
        </button>
    )
}

// Predefined Empty States - Yaygın kullanım durumları için
export interface PresetEmptyStateProps extends Omit<EmptyStateProps, 'icon' | 'title' | 'description'> {
    type: 'no-data' | 'no-results' | 'no-permissions' | 'error' | 'offline' | 'maintenance'
}

export function PresetEmptyState({ type, action, ...props }: PresetEmptyStateProps) {
    const presets = {
        'no-data': {
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'Henüz veri yok',
            description: 'Bu bölümde gösterilecek herhangi bir veri bulunmuyor.'
        },
        'no-results': {
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            title: 'Sonuç bulunamadı',
            description: 'Arama kriterlerinize uygun sonuç bulunamadı. Lütfen farklı terimler deneyin.'
        },
        'no-permissions': {
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m12-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Erişim yetkiniz yok',
            description: 'Bu sayfayı görüntülemek için yeterli yetkiye sahip değilsiniz.'
        },
        'error': {
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            ),
            title: 'Bir hata oluştu',
            description: 'İstek işlenirken bir sorun yaşandı. Lütfen tekrar deneyin.'
        },
        'offline': {
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v6m0 6v6" />
                </svg>
            ),
            title: 'İnternet bağlantısı yok',
            description: 'Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.'
        },
        'maintenance': {
            icon: (
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Bakım modu',
            description: 'Sistem şu anda bakımda. Lütfen daha sonra tekrar deneyin.'
        }
    }

    const preset = presets[type]

    return (
        <EmptyState
            icon={preset.icon}
            title={preset.title}
            description={preset.description}
            action={action}
            {...props}
        />
    )
}
