import { supabase } from '../lib/supabase'

// Database setup durumunu kontrol et
export async function checkDatabaseSetup() {
  console.log('🔍 Checking database setup...')
  
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
        console.log(`❌ ${tableName}: ${error.message}`)
      } else {
        results.push({ table: tableName, status: 'exists', count: data?.length || 0 })
        console.log(`✅ ${tableName}: Table exists`)
      }
    } catch (err) {
      results.push({ table: tableName, status: 'error', error: err })
      console.log(`⚠️ ${tableName}: Unexpected error`)
    }
  }
  
  return results
}

// Task categories test data oluştur
export async function createTestTaskCategories() {
  console.log('📝 Creating test task categories...')
  
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
    
    console.log('✅ Test task categories created:', data)
    return { success: true, data }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    return { success: false, error: err }
  }
}

// Ana test fonksiyonu
export async function testSupabaseConnection() {
  console.log('🚀 Starting Supabase connection test...')
  
  // 1. Database setup kontrolü
  const setupResults = await checkDatabaseSetup()
  const existingTables = setupResults.filter(r => r.status === 'exists').length
  const totalTables = setupResults.length
  
  console.log(`\n📊 Database Status: ${existingTables}/${totalTables} tables exist`)
  
  if (existingTables === 0) {
    console.log('❌ No tables found! Database setup required.')
    console.log('👉 Run setup-database-complete.sql in Supabase SQL Editor')
    return { success: false, message: 'Database not set up', results: setupResults }
  }
  
  if (existingTables < totalTables) {
    console.log('⚠️ Some tables missing! Incomplete database setup.')
    console.log('👉 Run setup-database-complete.sql in Supabase SQL Editor')
  }
  
  // 2. Test data oluşturma (eğer task_categories varsa)
  const taskCategoriesExists = setupResults.find(r => r.table === 'task_categories' && r.status === 'exists')
  if (taskCategoriesExists) {
    await createTestTaskCategories()
  }
  
  console.log('\n✅ Supabase connection test completed!')
  return { success: true, results: setupResults, tablesFound: existingTables, totalTables }
}

// Eğer bu dosya doğrudan çalıştırılırsa test et
if (typeof window === 'undefined') {
  // Node.js ortamında
  testSupabaseConnection()
}
