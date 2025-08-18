import { SkeletonCard, SkeletonTable, SkeletonStats } from '../Loading'
import { Heart, Building, PiggyBank } from 'lucide-react'

interface DonationsModuleLoadingProps {
  type?: 'dashboard' | 'table' | 'form' | 'vault' | 'tracking' | 'stats' | 'applications' | 'students'
}

export const DonationsModuleLoading = ({ type = 'dashboard' }: DonationsModuleLoadingProps) => {
  switch (type) {
    case 'dashboard':
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="h-8 w-8 text-muted animate-pulse" />
            <div className="h-6 bg-muted rounded w-40 animate-pulse"></div>
          </div>
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      )
    
    case 'table':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded w-20 animate-pulse"></div>
            ))}
          </div>
          <SkeletonTable rows={10} columns={7} />
        </div>
      )
    
    case 'form':
      return (
        <div className="max-w-3xl mx-auto">
          <div className="h-6 bg-muted rounded w-64 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-6">
            <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-muted rounded w-20 animate-pulse"></div>
          </div>
        </div>
      )
    
    case 'vault':
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Building className="h-8 w-8 text-muted animate-pulse" />
            <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                  <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-8 bg-muted rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      )
    
    case 'tracking':
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <PiggyBank className="h-8 w-8 text-muted animate-pulse" />
            <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <div className="h-4 bg-muted rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
          <SkeletonTable rows={8} columns={5} />
        </div>
      )
    
    default:
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Heart className="h-8 w-8 text-muted animate-pulse mx-auto mb-3" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          </div>
        </div>
      )
  }
}

export default DonationsModuleLoading