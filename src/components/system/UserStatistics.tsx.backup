import { Users, UserCheck, UserX, Shield, TrendingUp } from 'lucide-react'
import { getRoleDisplayName, type UserRole } from '@/types/permissions'

interface UserStatisticsProps {
  statistics: {
    total: number
    active: number
    inactive: number
    byRole: Record<UserRole, number>
    recentSignups: number
  }
}

export default function UserStatistics({ statistics }: UserStatisticsProps) {
  const roleColors: Record<UserRole, string> = {
    super_admin: 'text-red-600 bg-red-50 border-red-200',
    admin: 'text-orange-600 bg-orange-50 border-orange-200',
    manager: 'text-purple-600 bg-purple-50 border-purple-200',
    coordinator: 'text-blue-600 bg-blue-50 border-blue-200',
    operator: 'text-green-600 bg-green-50 border-green-200',
    viewer: 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'text-blue-600 bg-blue-50', 
    change 
  }: {
    title: string
    value: number
    icon: any
    color?: string
    change?: number
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+{change} bu hafta</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Toplam Kullanıcı"
          value={statistics.total}
          icon={Users}
          color="text-blue-600 bg-blue-50"
          change={statistics.recentSignups}
        />
        <StatCard
          title="Aktif Kullanıcı"
          value={statistics.active}
          icon={UserCheck}
          color="text-green-600 bg-green-50"
        />
        <StatCard
          title="Pasif Kullanıcı"
          value={statistics.inactive}
          icon={UserX}
          color="text-red-600 bg-red-50"
        />
        <StatCard
          title="Yönetici Sayısı"
          value={statistics.byRole.admin + statistics.byRole.super_admin}
          icon={Shield}
          color="text-purple-600 bg-purple-50"
        />
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rol Dağılımı</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(Object.entries(statistics.byRole) as [UserRole, number][]).map(([role, count]) => (
            <div
              key={role}
              className={`p-4 rounded-lg border-2 ${roleColors[role]}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{getRoleDisplayName(role)}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs">
                    {statistics.total > 0 
                      ? `${Math.round((count / statistics.total) * 100)}%`
                      : '0%'
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Özet Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Kullanıcı Durumu</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Aktif Rate:</span>
                <span className="text-sm font-medium text-green-600">
                  {statistics.total > 0 
                    ? `${Math.round((statistics.active / statistics.total) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bu Hafta Yeni:</span>
                <span className="text-sm font-medium text-blue-600">
                  {statistics.recentSignups}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Yetki Dağılımı</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Yönetici:</span>
                <span className="text-sm font-medium text-purple-600">
                  {statistics.byRole.admin + statistics.byRole.super_admin}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Operasyonel:</span>
                <span className="text-sm font-medium text-blue-600">
                  {statistics.byRole.manager + statistics.byRole.coordinator + statistics.byRole.operator}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Görüntüleyici:</span>
                <span className="text-sm font-medium text-gray-600">
                  {statistics.byRole.viewer}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
