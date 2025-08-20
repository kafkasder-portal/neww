import { supabase } from './supabase'
import type { ApiResponse } from '../api/types'

export async function uploadBeneficiaryDocument(
  beneficiaryId: string,
  file: File,
  documentType: string = 'uploaded'
): Promise<ApiResponse<{ filePath: string }>> {
  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const path = `beneficiaries/${beneficiaryId}/${Date.now()}-${sanitizedName}`

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(path, file, { upsert: true, cacheControl: '3600' })

    if (uploadError || !uploadData?.path) {
      return { success: false, data: { filePath: '' }, error: uploadError?.message || 'Upload failed' }
    }

    const filePath = uploadData.path

    const { error: insertError } = await supabase
      .from('documents')
      .insert({
        beneficiary_id: beneficiaryId,
        document_type: documentType,
        file_name: file.name,
        file_path: filePath,
      })

    if (insertError) {
      return { success: false, data: { filePath }, error: insertError.message }
    }

    return { success: true, data: { filePath } }
  } catch (error) {
    return { success: false, data: { filePath: '' }, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}


