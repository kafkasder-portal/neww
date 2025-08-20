import { SkeletonCard, SkeletonTable, SkeletonStats } from '../Loading'
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react'

interface ScholarshipModuleLoadingProps {
  type?: 'dashboard' | 'table' | 'form' | 'students' | 'applications' | 'vault' | 'stats' | 'tracking'
}

export const ScholarshipModuleLoading = ({ type = 'dashboard' }: ScholarshipModuleLoadingProps) => {
  switch (type) {
    case 'dashboard':
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="h-8 w-8 text-muted animate-pulse" />
            <div className="h-6 bg-muted rounded w-36 animate-pulse"></div>
          </div>
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              <SkeletonCard />
            </div>
            <div className="space-y-4">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              <SkeletonCard />
            </div>
          </div>
        </div>
      )
    
    case 'table':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-muted rounded w-28 animate-pulse"></div>
              <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            {['Tümü', 'Aktif', 'Beklemede', 'Tamamlanan'].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded w-20 animate-pulse"></div>
            ))}
          </div>
          <SkeletonTable rows={12} columns={8} />
        </div>
      )
    
    case 'form':
      return (
        <div className="max-w-4xl mx-auto">
          <div className="h-6 bg-muted rounded w-64 mb-6 animate-pulse"></div>
          <div className="space-y-8">
            {/* Kişisel Bilgiler */}
            <div className="space-y-4">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Eğitim Bilgileri */}
            <div className="space-y-4">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Burs Bilgileri */}
            <div className="space-y-4">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-6">
            <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-muted rounded w-20 animate-pulse"></div>
          </div>
        </div>
      )
    
    case 'students':
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-8 w-8 text-muted animate-pulse" />
            <div className="h-6 bg-muted rounded w-40 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: Users, label: 'Toplam Öğrenci' },
              { icon: BookOpen, label: 'Aktif Burslar' },
              { icon: Award, label: 'Başarılı' },
              { icon: GraduationCap, label: 'Mezun' }
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
          <SkeletonTable rows={10} columns={7} />
        </div>
      )
    
    case 'applications':
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-muted animate-pulse" />
            <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {['Yeni Başvurular', 'İncelenen', 'Onaylanan'].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-8 bg-muted rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
          <SkeletonTable rows={8} columns={6} />
        </div>
      )
    
    default:
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <GraduationCap className="h-8 w-8 text-muted animate-pulse mx-auto mb-3" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          </div>
        </div>
      )
  }
}

export default ScholarshipModuleLoading