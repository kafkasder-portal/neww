import { SkeletonCard, SkeletonTable, SkeletonStats } from '../Loading'
import { Users, DollarSign, FileText, TrendingUp } from 'lucide-react'

interface AidModuleLoadingProps {
  type?: 'dashboard' | 'table' | 'form' | 'stats' | 'applications' | 'tracking' | 'vault' | 'students'
}

export const AidModuleLoading = ({ type = 'dashboard' }: AidModuleLoadingProps) => {
  switch (type) {
    case 'dashboard':
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
            <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
          </div>
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
          </div>
          <SkeletonTable rows={8} columns={6} />
        </div>
      )
    
    case 'form':
      return (
        <div className="max-w-2xl mx-auto">
          <div className="h-6 bg-muted rounded w-64 mb-6 animate-pulse"></div>
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-muted rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      )
    
    case 'stats':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Yararlanıcılar' },
              { icon: DollarSign, label: 'Toplam Yardım' },
              { icon: FileText, label: 'Başvurular' },
              { icon: TrendingUp, label: 'Bu Ay' }
            ].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    
    default:
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse mx-auto mb-3"></div>
            <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          </div>
        </div>
      )
  }
}

export default AidModuleLoading