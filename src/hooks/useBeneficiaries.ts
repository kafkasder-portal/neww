import { useState, useCallback } from 'react'
import { supabase, type Database } from '@lib/supabase'
import { toast } from 'sonner'
import { getErrorMessage, logErrorSafely } from '@utils/errorMessageUtils'
import type { FormData } from '@/types/beneficiary'

type BeneficiaryRow = Database['public']['Tables']['beneficiaries']['Row']

// Sıralı ID oluşturma fonksiyonu
export const getNextSequentialId = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('beneficiaries')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error getting next ID:', error)
    return 1
  }

  return data && data.length > 0 ? data[0].id + 1 : 1
}

export const useBeneficiaries = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<BeneficiaryRow[]>([])

  const loadBeneficiaries = useCallback(async (searchTerm?: string) => {
    setLoading(true)
    let query = supabase.from('beneficiaries').select('*').order('created_at', { ascending: false })
    
    // Apply basic search filter
    if (searchTerm?.trim()) {
      query = query.or(
        `name.ilike.%${searchTerm}%,surname.ilike.%${searchTerm}%,identity_no.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,district.ilike.%${searchTerm}%`
      )
    }
    
    const { data, error } = await query
    if (error) {
      logErrorSafely('Beneficiaries fetch error', error)

      const errorMessage = getErrorMessage(error)
      if (errorMessage.includes('relation') || errorMessage.includes('table') || errorMessage.includes('does not exist')) {
        toast.error('Veritabanı tabloları bulunamadı. Lütfen sistem yöneticisine başvurun.')
      } else if (errorMessage.includes('connection') || errorMessage.includes('network')) {
        toast.error('Bağlantı hatası. İnternet bağlantınızı kontrol edin.')
      } else {
        toast.error(`İhtiyaç sahipleri yüklenirken hata oluştu: ${errorMessage}`)
      }

      setRows([])
    } else {
      setRows(data || [])
    }
    setLoading(false)
  }, [])

  const saveBeneficiary = async (formData: FormData, editingId?: number | null) => {
    if (!formData.name.trim() || !formData.surname.trim() || !formData.identity_no.trim()) {
      toast.error('Ad, Soyad ve Kimlik No alanları zorunludur')
      return false
    }

    setSaving(true)
    try {
      const dataToSave = {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        category: formData.category,
        nationality: formData.nationality.trim(),
        birth_date: formData.birth_date || null,
        identity_no: formData.identity_no.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        district: formData.district.trim() || null,
        status: formData.status,
        fund_region: formData.fund_region
      }

      let result
      if (editingId) {
        // Güncelleme işlemi
        result = await supabase
          .from('beneficiaries')
          .update(dataToSave)
          .eq('id', editingId)
          .select()
      } else {
        // Yeni kayıt işlemi - sıralı ID ile
        const nextId = await getNextSequentialId()
        const dataWithId = { ...dataToSave, id: nextId }
        result = await supabase
          .from('beneficiaries')
          .insert([dataWithId])
          .select()
      }

      const { error } = result

      if (error) {
        console.error('Save error:', error)
        toast.error('Kayıt sırasında hata oluştu: ' + error.message)
        return false
      } else {
        toast.success(editingId ? 'İhtiyaç sahibi başarıyla güncellendi' : 'İhtiyaç sahibi başarıyla kaydedildi')
        return true
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Kayıt sırasında beklenmeyen hata oluştu')
      return false
    } finally {
      setSaving(false)
    }
  }

  const deleteBeneficiary = async (id: number) => {
    try {
      const { error } = await supabase
        .from('beneficiaries')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete error:', error)
        toast.error('Silme işlemi sırasında hata oluştu: ' + error.message)
        return false
      } else {
        toast.success('İhtiyaç sahibi başarıyla silindi')
        return true
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Silme işlemi sırasında beklenmeyen hata oluştu')
      return false
    }
  }

  return {
    loading,
    saving,
    setSaving,
    rows,
    setRows,
    loadBeneficiaries,
    saveBeneficiary,
    deleteBeneficiary
  }
}