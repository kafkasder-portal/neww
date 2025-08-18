import { supabase } from '../lib/supabase'
import type { UserRole, UserProfile } from '../types/permissions'

export interface UserWithProfile {
  id: string
  email: string
  full_name: string | null
  display_name: string | null
  role: UserRole
  department: string | null
  position: string | null
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
  email_confirmed_at: string | null
  last_sign_in_at: string | null
  can_manage_users: boolean
}

export interface RoleChangeLog {
  id: string
  target_user_id: string
  changed_by: string
  old_role: string
  new_role: string
  reason: string | null
  created_at: string
}

// Tüm kullanıcıları getir (sadece admin)
export async function getAllUsers(): Promise<UserWithProfile[]> {
  const { data, error } = await supabase
    .from('user_management_view')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Kullanıcılar getirilemedi: ${error.message}`)
  }

  return data || []
}

// Kullanıcı rolünü değiştir
export async function changeUserRole(
  targetUserId: string,
  newRole: UserRole,
  reason?: string
): Promise<boolean> {
  const currentUser = await supabase.auth.getUser()
  if (!currentUser.data.user) {
    throw new Error('Oturum bulunamadı')
  }

  const { data, error } = await supabase.rpc('change_user_role', {
    target_user_id: targetUserId,
    new_role: newRole,
    changed_by: currentUser.data.user.id
  })

  if (error) {
    throw new Error(`Rol değiştirilemedi: ${error.message}`)
  }

  // Eğer reason varsa, log'a ekle
  if (reason) {
    await supabase
      .from('role_change_logs')
      .update({ reason })
      .eq('target_user_id', targetUserId)
      .eq('new_role', newRole)
      .order('created_at', { ascending: false })
      .limit(1)
  }

  return data
}

// Kullanıcı profilini güncelle
export async function updateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Profil güncellenemedi: ${error.message}`)
  }

  return data
}

// Kullanıcıyı aktif/pasif yap
export async function toggleUserStatus(
  userId: string,
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from('user_profiles')
    .update({ 
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) {
    throw new Error(`Kullanıcı durumu değiştirilemedi: ${error.message}`)
  }
}

// Rol değişiklik loglarını getir
export async function getRoleChangeLogs(
  userId?: string,
  limit = 50
): Promise<RoleChangeLog[]> {
  let query = supabase
    .from('role_change_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (userId) {
    query = query.eq('target_user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Log kayıtları getirilemedi: ${error.message}`)
  }

  return data || []
}

// Mevcut kullanıcının rolünü ve yetkilerini kontrol et
export async function getCurrentUserPermissions(): Promise<{
  user: import('@supabase/supabase-js').User | null
  profile: UserProfile | null
  canManageUsers: boolean
}> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Oturum bulunamadı')
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    // Profil yoksa varsayılan oluştur
    const defaultProfile: UserProfile = {
      id: user.id,
      full_name: user.email || null,
      avatar_url: null,
      department: null,
      phone: null,
      email: user.email || '',
      role: 'viewer' as UserRole,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    return {
      user,
      profile: defaultProfile,
      canManageUsers: false
    }
  }

  const canManageUsers = ['admin', 'super_admin'].includes(profile?.role || '')

  return {
    user,
    profile,
    canManageUsers
  }
}

// Kullanıcı istatistikleri
export async function getUserStatistics(): Promise<{
  total: number
  active: number
  inactive: number
  byRole: Record<UserRole, number>
  recentSignups: number
}> {
  // Toplam kullanıcı sayısı
  const { count: total, error: totalError } = await supabase
    .from('user_management_view')
    .select('*', { count: 'exact', head: true })

  // Aktif kullanıcı sayısı
  const { count: active, error: activeError } = await supabase
    .from('user_management_view')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Role göre dağılım
  const { data: roleData, error: roleError } = await supabase
    .from('user_management_view')
    .select('role')

  // Son 7 gündeki kayıtlar
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  
  const { count: recentSignups, error: recentError } = await supabase
    .from('user_management_view')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo.toISOString())

  if (totalError || activeError || roleError || recentError) {
    throw new Error('İstatistikler getirilemedi')
  }

  // Role göre sayıları hesapla
  const byRole: Record<UserRole, number> = {
    super_admin: 0,
    admin: 0,
    manager: 0,
    coordinator: 0,
    operator: 0,
    viewer: 0
  }

  roleData?.forEach((item: { role: string }) => {
    if (item.role in byRole) {
      byRole[item.role as UserRole]++
    }
  })

  return {
    total: total || 0,
    active: active || 0,
    inactive: (total || 0) - (active || 0),
    byRole,
    recentSignups: recentSignups || 0
  }
}

// Kullanıcı arama
export async function searchUsers(query: string): Promise<UserWithProfile[]> {
  const { data, error } = await supabase
    .from('user_management_view')
    .select('*')
    .or(`email.ilike.%${query}%,full_name.ilike.%${query}%,department.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Arama yapılamadı: ${error.message}`)
  }

  return data || []
}

// Demo hesabı oluştur
export async function createDemoAccount(): Promise<{
  email: string
  password: string
  profile: UserProfile
}> {
  // Rastgele demo hesabı bilgileri oluştur
  const timestamp = Date.now()
  const demoEmail = `demo_${timestamp}@example.com`
  const demoPassword = `Demo123!${timestamp.toString().slice(-4)}`
  
  try {
    // Demo kullanıcısını oluştur
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: demoEmail,
      password: demoPassword,
      options: {
        data: {
          full_name: `Demo Kullanıcı ${timestamp.toString().slice(-4)}`,
          department: 'Demo Departmanı'
        }
      }
    })

    if (authError || !authData.user) {
      throw new Error(`Demo hesabı oluşturulamadı: ${authError?.message || 'Bilinmeyen hata'}`)
    }

    // Kullanıcı profilini oluştur
    const profileData: Partial<UserProfile> = {
      id: authData.user.id,
      full_name: `Demo Kullanıcı ${timestamp.toString().slice(-4)}`,
      email: demoEmail,
      department: 'Demo Departmanı',
      role: 'coordinator' as UserRole, // Demo hesabına coordinator yetkisi ver
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single()

    if (profileError) {
      // Auth kullanıcısını sil
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw new Error(`Demo profili oluşturulamadı: ${profileError.message}`)
    }

    return {
      email: demoEmail,
      password: demoPassword,
      profile: profile as UserProfile
    }
  } catch (error) {
    throw new Error(`Demo hesabı oluşturma hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
  }
}
