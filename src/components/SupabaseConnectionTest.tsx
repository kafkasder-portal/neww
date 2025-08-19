import { useState } from 'react'
import { Card } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { supabase } from '../lib/supabase'
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Wifi,
  User,
  Table,
  Key
} from 'lucide-react'

interface ConnectionTest {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  duration?: number
}

export default function SupabaseConnectionTest() {
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: 'Supabase Client Initialization', status: 'pending', message: 'Testing client setup...' },
    { name: 'Database Connection', status: 'pending', message: 'Testing database connectivity...' },
    { name: 'Authentication Service', status: 'pending', message: 'Testing auth service...' },
    { name: 'Table Access', status: 'pending', message: 'Testing table permissions...' },
    { name: 'Real-time Features', status: 'pending', message: 'Testing real-time subscriptions...' }
  ])
  
  const [isRunning, setIsRunning] = useState(false)
  const [overallStatus, setOverallStatus] = useState<'pending' | 'success' | 'error'>('pending')

  const updateTest = (index: number, status: 'success' | 'error', message: string, duration?: number) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, duration } : test
    ))
  }

  const runTests = async () => {
    setIsRunning(true)
    setOverallStatus('pending')

    // Test 1: Client Initialization
    const startTime1 = Date.now()
    try {
      if (supabase) {
        updateTest(0, 'success', 'Supabase client initialized successfully', Date.now() - startTime1)
      } else {
        updateTest(0, 'error', 'Failed to initialize Supabase client')
        setIsRunning(false)
        setOverallStatus('error')
        return
      }
    } catch (error) {
      updateTest(0, 'error', `Client initialization failed: ${error}`)
      setIsRunning(false)
      setOverallStatus('error')
      return
    }

    // Test 2: Database Connection
    const startTime2 = Date.now()
    try {
      const { error } = await supabase
        .from('beneficiaries')
        .select('count', { count: 'exact', head: true })
        .limit(0)

      if (error) {
        updateTest(1, 'error', `Database connection failed: ${error.message}`)
      } else {
        updateTest(1, 'success', `Database connected successfully. Tables accessible.`, Date.now() - startTime2)
      }
    } catch (error) {
      updateTest(1, 'error', `Database connection error: ${error}`)
    }

    // Test 3: Authentication Service
    const startTime3 = Date.now()
    try {
      const { data: session, error } = await supabase.auth.getSession()
      
      if (error) {
        updateTest(2, 'error', `Auth service error: ${error.message}`)
      } else {
        const message = session?.session 
          ? `Authenticated user: ${session.session.user?.email}` 
          : 'Auth service working (no active session)'
        updateTest(2, 'success', message, Date.now() - startTime3)
      }
    } catch (error) {
      updateTest(2, 'error', `Auth service failed: ${error}`)
    }

    // Test 4: Table Access
    const startTime4 = Date.now()
    try {
      const { error: beneficiariesError } = await supabase
        .from('beneficiaries')
        .select('id')
        .limit(1)

      const { error: applicationsError } = await supabase
        .from('applications')
        .select('id')
        .limit(1)

      if (beneficiariesError || applicationsError) {
        const errorMsg = beneficiariesError?.message || applicationsError?.message || 'Unknown table error'
        updateTest(3, 'error', `Table access failed: ${errorMsg}`)
      } else {
        updateTest(3, 'success', 'All main tables accessible', Date.now() - startTime4)
      }
    } catch (error) {
      updateTest(3, 'error', `Table access error: ${error}`)
    }

    // Test 5: Real-time Features
    const startTime5 = Date.now()
    try {
      const channel = supabase
        .channel('test-channel')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'beneficiaries' }, 
          () => {}
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            updateTest(4, 'success', 'Real-time subscriptions working', Date.now() - startTime5)
            channel.unsubscribe()
          } else if (status === 'CHANNEL_ERROR') {
            updateTest(4, 'error', 'Real-time subscription failed')
            channel.unsubscribe()
          }
        })

      // Timeout for real-time test
      setTimeout(() => {
        if (tests[4].status === 'pending') {
          updateTest(4, 'error', 'Real-time test timeout')
          channel.unsubscribe()
        }
      }, 5000)
    } catch (error) {
      updateTest(4, 'error', `Real-time error: ${error}`)
    }

    // Wait a bit and determine overall status
    setTimeout(() => {
      const hasErrors = tests.some(test => test.status === 'error')
      setOverallStatus(hasErrors ? 'error' : 'success')
      setIsRunning(false)
    }, 6000)
  }

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getTestIcon = (index: number) => {
    const icons = [
      <Key className="h-4 w-4 text-muted-foreground" />,
      <Database className="h-4 w-4 text-muted-foreground" />,
      <User className="h-4 w-4 text-muted-foreground" />,
      <Table className="h-4 w-4 text-muted-foreground" />,
      <Wifi className="h-4 w-4 text-muted-foreground" />
    ]
    return icons[index] || <AlertCircle className="h-4 w-4 text-muted-foreground" />
  }

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'success':
        return 'from-green-500 to-green-600'
      case 'error':
        return 'from-red-500 to-red-600'
      default:
        return 'from-blue-500 to-blue-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getOverallStatusColor()} rounded-xl p-6 text-white`}>
        <div className="flex items-center gap-3 mb-3">
          <Database className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
        </div>
        <p className="text-white/90">
          Veritabanı bağlantısı ve servislerin test edilmesi
        </p>
      </div>

      {/* Overall Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(overallStatus)}
            <div>
              <h2 className="text-lg font-semibold">
                {overallStatus === 'success' && 'All Systems Operational'}
                {overallStatus === 'error' && 'System Issues Detected'}
                {overallStatus === 'pending' && 'System Status Check'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {overallStatus === 'success' && 'Supabase services are working properly'}
                {overallStatus === 'error' && 'Some services are experiencing issues'}
                {overallStatus === 'pending' && 'Testing system components'}
              </p>
            </div>
          </div>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Run Tests
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Test Results */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Test Results</h3>
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getTestIcon(index)}
                <div>
                  <h4 className="font-medium">{test.name}</h4>
                  <p className="text-sm text-muted-foreground">{test.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {test.duration && (
                  <span className="text-xs text-muted-foreground">
                    {test.duration}ms
                  </span>
                )}
                {getStatusIcon(test.status)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Environment Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Environment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Supabase URL:</p>
            <p className="text-muted-foreground font-mono break-all">
              {import.meta.env.VITE_SUPABASE_URL || 'Not configured'}
            </p>
          </div>
          <div>
            <p className="font-medium">Environment:</p>
            <p className="text-muted-foreground">
              {import.meta.env.MODE || 'development'}
            </p>
          </div>
          <div>
            <p className="font-medium">API Key Status:</p>
            <p className="text-muted-foreground">
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Missing'}
            </p>
          </div>
          <div>
            <p className="font-medium">Real-time Enabled:</p>
            <p className="text-muted-foreground">
              {import.meta.env.VITE_ENABLE_REALTIME ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </Card>

      {/* Documentation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Setup Instructions</h3>
        <div className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium">1. Environment Variables</h4>
            <p className="text-muted-foreground">
              Configure your .env file with Supabase credentials:
            </p>
            <pre className="bg-muted p-3 rounded mt-2 overflow-x-auto">
              <code>
{`VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key`}
              </code>
            </pre>
          </div>
          <div>
            <h4 className="font-medium">2. Database Setup</h4>
            <p className="text-muted-foreground">
              Run the migration scripts to create necessary tables:
            </p>
            <pre className="bg-muted p-3 rounded mt-2">
              <code>npm run db:setup</code>
            </pre>
          </div>
        </div>
      </Card>
    </div>
  )
}
