// Simple Node.js script to test Supabase authentication
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ibqhfgpdgzrhvyfpgjxx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlicWhmZ3BkZ3pyaHZ5ZnBnanh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDk3NDcsImV4cCI6MjA3MDY4NTc0N30.1vSikm9_Dn978BctKWXhoOfPCKztLaBNgr8OEIVIXNg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuthentication() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test 1: Check if we can query the user_profiles table
    console.log('\n1. Testing user_profiles table query...')
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, full_name, role, is_active')
      .limit(5)
    
    if (profilesError) {
      console.error('❌ User profiles query failed:', profilesError)
    } else {
      console.log('✅ User profiles query successful:')
      console.log(profiles)
    }

    // Test 2: Get current session
    console.log('\n2. Testing session retrieval...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session retrieval failed:', sessionError)
    } else {
      console.log('✅ Session retrieval successful:', session ? 'User logged in' : 'No active session')
    }

    // Test 3: Test auth state change listener
    console.log('\n3. Setting up auth state change listener...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`📡 Auth event: ${event}`, session ? `User: ${session.user.email}` : 'No session')
    })

    console.log('✅ Auth listener setup successful')
    
    // Clean up
    setTimeout(() => {
      subscription.unsubscribe()
      console.log('\n🧹 Cleaned up auth listener')
    }, 2000)

  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

testAuthentication()
