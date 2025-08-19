// Migration Runner Script
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// .env dosyasını manuel olarak oku
function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf8')
    const env = {}
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '')
        env[key.trim()] = value.trim()
      }
    })
    
    return env
  } catch (error) {
    console.log('❌ .env dosyası okunamadı:', error.message)
    return {}
  }
}

const env = loadEnv()
const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

console.log('🔧 Migration Runner Başlatılıyor...')

async function runMigration() {
  try {
    console.log('\n📋 1. RLS Politikalarını Devre Dışı Bırakma')
    
    // RLS'yi devre dışı bırak
    const tables = [
      'user_profiles',
      'beneficiaries',
      'family_members',
      'applications',
      'aid_records',
      'payments',
      'in_kind_aids',
      'meetings',
      'meeting_attendees',
      'meeting_agenda',
      'meeting_minutes',
      'documents',
      'notifications'
    ]
    
    for (const table of tables) {
      try {
        // RLS'yi devre dışı bırak (SQL ile)
        const { error } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY;`
        })
        
        if (error) {
          console.log(`⚠️ ${table}: RLS devre dışı bırakılamadı (${error.message})`)
        } else {
          console.log(`✅ ${table}: RLS devre dışı bırakıldı`)
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`)
      }
    }
    
    console.log('\n📋 2. Eksik Tabloyu Oluşturma')
    
    // error_logs tablosunu oluştur
    const createErrorLogsSQL = `
      CREATE TABLE IF NOT EXISTS public.error_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        error_type TEXT NOT NULL,
        error_message TEXT NOT NULL,
        stack_trace TEXT,
        user_id UUID REFERENCES public.user_profiles(id),
        request_data JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
    
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: createErrorLogsSQL
      })
      
      if (error) {
        console.log(`❌ error_logs tablosu oluşturulamadı: ${error.message}`)
      } else {
        console.log(`✅ error_logs tablosu oluşturuldu`)
      }
    } catch (err) {
      console.log(`❌ error_logs tablosu hatası: ${err.message}`)
    }
    
    console.log('\n📋 3. Tablo Erişim Testi')
    
    // Tüm tabloları test et
    const allTables = [...tables, 'error_logs']
    const accessibleTables = []
    const inaccessibleTables = []
    
    for (const table of allTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          inaccessibleTables.push({ table, error: error.message })
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          accessibleTables.push(table)
          console.log(`✅ ${table}: Erişilebilir`)
        }
      } catch (err) {
        inaccessibleTables.push({ table, error: err.message })
        console.log(`❌ ${table}: ${err.message}`)
      }
    }
    
    console.log('\n📊 ÖZET:')
    console.log(`✅ Erişilebilir tablolar: ${accessibleTables.length}`)
    console.log(`❌ Erişilemeyen tablolar: ${inaccessibleTables.length}`)
    
    if (inaccessibleTables.length > 0) {
      console.log('\n📋 Erişilemeyen Tablolar:')
      inaccessibleTables.forEach(({ table, error }) => {
        console.log(`  - ${table}: ${error}`)
      })
    }
    
    // Test verisi ekleme
    console.log('\n📋 4. Test Verisi Ekleme')
    
    for (const table of accessibleTables) {
      try {
        let testData = {}
        
        switch (table) {
          case 'beneficiaries':
            testData = {
              full_name: 'Migration Test',
              identity_number: '11111111111',
              date_of_birth: '1990-01-01',
              gender: 'male',
              phone: '05551111111',
              email: 'migration@test.com',
              address: 'Migration Test Adres',
              city: 'İstanbul',
              district: 'Test',
              category: 'unemployed',
              priority_level: 'medium',
              notes: 'Migration test',
              is_active: true
            }
            break
            
          case 'error_logs':
            testData = {
              error_type: 'migration_test',
              error_message: 'Migration test mesajı',
              stack_trace: 'Migration test stack',
              request_data: { migration: true }
            }
            break
            
          default:
            testData = { migration_test: true, created_at: new Date().toISOString() }
        }
        
        if (Object.keys(testData).length > 0) {
          const { data: insertData, error: insertError } = await supabase
            .from(table)
            .insert(testData)
            .select()
          
          if (insertError) {
            console.log(`❌ ${table} veri ekleme hatası: ${insertError.message}`)
          } else {
            console.log(`✅ ${table}: Test verisi eklendi`)
            
            // Test verisini sil
            if (insertData && insertData.length > 0) {
              await supabase
                .from(table)
                .delete()
                .eq('id', insertData[0].id)
            }
          }
        }
        
      } catch (err) {
        console.log(`❌ ${table} test hatası: ${err.message}`)
      }
    }
    
    return {
      accessible: accessibleTables,
      inaccessible: inaccessibleTables
    }
    
  } catch (error) {
    console.log('❌ Genel hata:', error.message)
    return null
  }
}

// Migration'ı çalıştır
runMigration()
  .then(result => {
    if (result) {
      console.log('\n🎉 Migration tamamlandı!')
      console.log(`✅ ${result.accessible.length} tablo erişilebilir`)
      console.log(`❌ ${result.inaccessible.length} tablo erişilemiyor`)
      
      if (result.inaccessible.length === 0) {
        console.log('\n🎉 Tüm tablolar başarıyla düzeltildi!')
      } else {
        console.log('\n💡 ÖNERİ: Erişilemeyen tablolar için manuel SQL komutları çalıştırın')
      }
    } else {
      console.log('\n💥 Migration başarısız!')
    }
    process.exit(result ? 0 : 1)
  })
  .catch(error => {
    console.log('💥 Migration çalıştırma hatası:', error)
    process.exit(1)
  })
