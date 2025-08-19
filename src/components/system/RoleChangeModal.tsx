import React, { useState } from 'react'
import { X, Shield, AlertTriangle } from 'lucide-react'
import { getRoleDisplayName, type UserRole } from '@/types/permissions'
import type { UserWithProfile } from '../../api/userManagement'
import { Modal } from '../Modal'

interface RoleChangeModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserWithProfile
  onRoleChange: (userId: string, newRole: UserRole, reason?: string) => Promise<{success: boolean, error?: string}>
  currentUserRole?: UserRole
}

export default function RoleChangeModal({ 
  isOpen, 
  onClose, 
  user, 
  onRoleChange
}: RoleChangeModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const roles: UserRole[] = ['super_admin', 'admin', 'manager', 'coordinator', 'operator', 'viewer']

  // Rol seçim yetkisi kontrolü - Role assignment disabled
  const canSelectRole = (_role: UserRole): boolean => {
    return false // All role changes disabled
  }

  const getRoleDescription = (role: UserRole): string => {
    const descriptions = {
      super_admin: 'Sistemin tüm özelliklerine erişim ve tüm yetkileri',
      admin: 'Kullanıcı yönetimi ve sistem ayarları dahil geniş yetkiler',
      manager: 'Departman yönetimi ve onay süreçlerinde yetki',
      coordinator: 'Proje koordinasyonu ve takım yönetimi yetkileri',
      operator: 'Günlük operasyonel işlemler için temel yetkiler',
      viewer: 'Sadece görüntüleme yetkisi, değişiklik yapamaz'
    }
    return descriptions[role] || ''
  }

  const getRoleColor = (role: UserRole): string => {
    const colors = {
      super_admin: 'border-red-300 bg-red-50 text-red-800',
      admin: 'border-orange-300 bg-orange-50 text-orange-800',
      manager: 'border-purple-300 bg-purple-50 text-purple-800',
      coordinator: 'border-blue-300 bg-blue-50 text-blue-800',
      operator: 'border-green-300 bg-green-50 text-green-800',
      viewer: 'border-gray-300 bg-gray-50 text-gray-800'
    }
    return colors[role] || 'border-gray-300 bg-gray-50 text-gray-800'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedRole === user.role) {
      setError('Lütfen farklı bir rol seçin')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await onRoleChange(user.id, selectedRole, reason.trim() || undefined)
      
      if (result.success) {
        onClose()
      } else {
        setError(result.error || 'Rol değiştirme işlemi başarısız')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null)
      setSelectedRole(user.role)
      setReason('')
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Kullanıcı Rolünü Değiştir
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium text-lg">
                  {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {user.full_name || user.email}
                </h4>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Mevcut Rol: <span className="font-medium">{getRoleDisplayName(user.role)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Role Assignment Disabled Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Bilgi:</strong> Rol atama işlevi devre dışı bırakılmıştır.
                  Tüm kullanıcılar otomatik olarak tam yetkiye sahiptir.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Yeni Rol Seçin
            </label>
            <div className="space-y-3">
              {roles.map((role) => (
                <label
                  key={role}
                  className={`relative flex cursor-pointer rounded-lg border p-4 hover:bg-gray-50 ${
                    selectedRole === role ? getRoleColor(role) : 'border-gray-300'
                  } ${
                    !canSelectRole(role) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    disabled={!canSelectRole(role) || isSubmitting}
                    className="sr-only"
                  />
                  <div className="flex w-full items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === role 
                          ? 'border-current bg-current' 
                          : 'border-gray-300'
                      }`}>
                        {selectedRole === role && (
                          <div className="h-2 w-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{getRoleDisplayName(role)}</p>
                        {role === user.role && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                            Mevcut
                          </span>
                        )}
                        {!canSelectRole(role) && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                            Yetki Yok
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {getRoleDescription(role)}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Değişiklik Nedeni (Opsiyonel)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              placeholder="Bu rol değişikliğinin nedenini açıklayın..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bu bilgi rol değişiklik loglarında saklanacak
            </p>
          </div>

          {/* Warning */}
          {selectedRole !== user.role && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <div className="ml-3">
                  <p className="text-sm text-amber-800">
                    <strong>Dikkat:</strong> Rol değişikliği kullanıcının sistem erişim yetkilerini değiştirecek. 
                    Bu işlem geri alınamaz ve kullanıcı yeni rolüne göre yetkilendirilecek.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedRole === user.role || !canSelectRole(selectedRole)}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Güncelleniyor...' : 'Rolü Değiştir'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
