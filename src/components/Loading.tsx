import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
  className?: string
}

export const Loading = ({ 
  size = 'md', 
  text = 'Yükleniyor...', 
  fullScreen = false,
  className = ''
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'
    : `flex flex-col items-center justify-center gap-3 ${className}`

  return (
    <div className={containerClass}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {text && (
        <p className={`text-muted-foreground ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  )
}

// Skeleton components for better loading states
export const SkeletonCard = () => (
  <div className="rounded-lg border bg-card p-4 animate-pulse">
    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
    <div className="h-6 bg-muted rounded w-1/4"></div>
  </div>
)

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="rounded-lg border bg-card overflow-hidden">
    <div className="border-b bg-muted/50 p-4">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded flex-1 animate-pulse"></div>
        ))}
      </div>
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b p-4 last:border-b-0">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-muted rounded flex-1 animate-pulse"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

export const SkeletonForm = () => (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
        <div className="h-10 bg-muted rounded animate-pulse"></div>
      </div>
    ))}
    <div className="flex gap-2 pt-4">
      <div className="h-10 bg-muted rounded w-20 animate-pulse"></div>
      <div className="h-10 bg-muted rounded w-16 animate-pulse"></div>
    </div>
  </div>
)

export default Loading
