import { supabase } from '../lib/supabase'

// Database setup durumunu kontrol et
export async function checkDatabaseSetup() {
  // Ana tabloları kontrol et
  const tables = ['meetings', 'tasks', 'conversations', 'messages', 'task_categories', 'notifications', 'user_profiles']
  const results = []
  
  for (const tableName of tables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
      
      if (error) {
        results.push({ table: tableName, status: 'missing', error: error.message })
        } else {
        results.push({ table: tableName, status: 'exists', count: data?.length || 0 })
        }
    } catch (err) {
      results.push({ table: tableName, status: 'error', error: err })
      }
  }
  
  return results
}

// Task categories test data oluştur
export async function createTestTaskCategories() {
  const categories = [
    { name: 'Geliştirme', description: 'Yazılım geliştirme görevleri', color: '#3B82F6' },
    { name: 'Raporlama', description: 'Rapor ve analiz görevleri', color: '#10B981' },
    { name: 'Test', description: 'Test ve kalite kontrol', color: '#EF4444' }
  ]
  
  try {
    const { data, error } = await supabase
      .from('task_categories')
      .insert(categories)
      .select()
    
    if (error) {
      console.error('❌ Task categories creation failed:', error)
      return { success: false, error }
    }
    
    return { success: true, data }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    return { success: false, error: err }
  }
}

// Ana test fonksiyonu
export async function testSupabaseConnection() {
  // 1. Database setup kontrolü
  const setupResults = await checkDatabaseSetup()
  const existingTables = setupResults.filter(r => r.status === 'exists').length
  const totalTables = setupResults.length
  
  if (existingTables === 0) {
    return { success: false, message: 'Database not set up', results: setupResults }
  }
  
  if (existingTables < totalTables) {
    }
  
  // 2. Test data oluşturma (eğer task_categories varsa)
  const taskCategoriesExists = setupResults.find(r => r.table === 'task_categories' && r.status === 'exists')
  if (taskCategoriesExists) {
    await createTestTaskCategories()
  }
  
  return { success: true, results: setupResults, tablesFound: existingTables, totalTables }
}

// Eğer bu dosya doğrudan çalıştırılırsa test et
if (typeof window === 'undefined') {
  // Node.js ortamında
  testSupabaseConnection()
}
