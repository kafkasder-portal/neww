import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UserRole, UserProfile } from '../types/permissions'
import {
  getAllUsers,
  changeUserRole,
  updateUserProfile,
  toggleUserStatus,
  getRoleChangeLogs,
  getCurrentUserPermissions,
  getUserStatistics,
  searchUsers,
  type UserWithProfile
} from '../api/userManagement'

// Kullanıcı listesi hook'u
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 dakika
    retry: 2
  })
}

// Mevcut kullanıcı yetkilerini kontrol etme hook'u
export function useCurrentUserPermissions() {
  return useQuery({
    queryKey: ['current-user-permissions'],
    queryFn: getCurrentUserPermissions,
    staleTime: 10 * 60 * 1000, // 10 dakika
    retry: 1
  })
}

// Kullanıcı istatistikleri hook'u
export function useUserStatistics() {
  return useQuery({
    queryKey: ['user-statistics'],
    queryFn: getUserStatistics,
    staleTime: 5 * 60 * 1000, // 5 dakika
    retry: 2
  })
}

// Rol değişiklik logları hook'u
export function useRoleChangeLogs(userId?: string) {
  return useQuery({
    queryKey: ['role-change-logs', userId],
    queryFn: () => getRoleChangeLogs(userId),
    staleTime: 2 * 60 * 1000, // 2 dakika
    enabled: !!userId
  })
}

// Rol değiştirme mutation'u
export function useChangeUserRole() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({
      targetUserId,
      newRole,
      reason
    }: {
      targetUserId: string
      newRole: UserRole
      reason?: string
    }) => changeUserRole(targetUserId, newRole, reason),
    onSuccess: () => {
      // Kullanıcı listesini ve istatistikleri yeniden getir
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user-statistics'] })
      queryClient.invalidateQueries({ queryKey: ['role-change-logs'] })
    }
  })
}

// Kullanıcı profil güncelleme mutation'u
export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({
      userId,
      profileData
    }: {
      userId: string
      profileData: Partial<UserProfile>
    }) => updateUserProfile(userId, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['current-user-permissions'] })
    }
  })
}

// Kullanıcı durumu değiştirme mutation'u
export function useToggleUserStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({
      userId,
      isActive
    }: {
      userId: string
      isActive: boolean
    }) => toggleUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user-statistics'] })
    }
  })
}

// Kullanıcı arama hook'u
export function useUserSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  
  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    
    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery])
  
  const searchResults = useQuery({
    queryKey: ['user-search', debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 2,
    staleTime: 30 * 1000 // 30 saniye
  })
  
  return {
    searchQuery,
    setSearchQuery,
    searchResults: searchResults.data || [],
    isSearching: searchResults.isFetching,
    searchError: searchResults.error
  }
}

// Kullanıcı yönetimi için genel hook
export function useUserManagement() {
  const users = useUsers()
  const permissions = useCurrentUserPermissions()
  const statistics = useUserStatistics()
  const changeRole = useChangeUserRole()
  const updateProfile = useUpdateUserProfile()
  const toggleStatus = useToggleUserStatus()
  const search = useUserSearch()
  
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  
  // Rol değiştirme fonksiyonu
  const handleRoleChange = async (
    targetUserId: string,
    newRole: UserRole,
    reason?: string
  ) => {
    try {
      await changeRole.mutateAsync({
        targetUserId,
        newRole,
        reason
      })
      setShowRoleModal(false)
      setSelectedUser(null)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    }
  }
  
  // Profil güncelleme fonksiyonu
  const handleProfileUpdate = async (
    userId: string,
    profileData: Partial<UserProfile>
  ) => {
    try {
      await updateProfile.mutateAsync({
        userId,
        profileData
      })
      setShowProfileModal(false)
      setSelectedUser(null)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    }
  }
  
  // Kullanıcı durumu değiştirme fonksiyonu
  const handleStatusToggle = async (
    userId: string,
    isActive: boolean
  ) => {
    try {
      await toggleStatus.mutateAsync({
        userId,
        isActive
      })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    }
  }
  
  // Kullanıcı seçme fonksiyonları
  const selectUserForRoleChange = (user: UserWithProfile) => {
    setSelectedUser(user)
    setShowRoleModal(true)
  }
  
  const selectUserForProfileEdit = (user: UserWithProfile) => {
    setSelectedUser(user)
    setShowProfileModal(true)
  }
  
  // Modal kapatma fonksiyonları
  const closeModals = () => {
    setShowRoleModal(false)
    setShowProfileModal(false)
    setSelectedUser(null)
  }
  
  return {
    // Data
    users: users.data || [],
    permissions: permissions.data,
    statistics: statistics.data,
    selectedUser,
    
    // Loading states
    isLoading: users.isLoading || permissions.isLoading,
    isUpdating: changeRole.isPending || updateProfile.isPending || toggleStatus.isPending,
    
    // Error states
    error: users.error || permissions.error || statistics.error,
    
    // Modal states
    showRoleModal,
    showProfileModal,
    
    // Actions
    handleRoleChange,
    handleProfileUpdate,
    handleStatusToggle,
    selectUserForRoleChange,
    selectUserForProfileEdit,
    closeModals,
    
    // Search
    search,
    
    // Refresh functions
    refetchUsers: users.refetch,
    refetchStatistics: statistics.refetch,
    refetchPermissions: permissions.refetch
  }
}
