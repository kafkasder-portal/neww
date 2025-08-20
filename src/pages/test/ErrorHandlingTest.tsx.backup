import React from 'react'
import { toast } from 'sonner'
import { getErrorMessage, createOperationErrorMessage, logErrorSafely, isNetworkError, isAuthError } from '../../utils/errorMessageUtils'

const ErrorHandlingTest: React.FC = () => {
  const testErrorMessages = () => {
    // Test different error types
    const errors = [
      new Error('Database connection failed'),
      { message: 'Validation error', code: 'VALIDATION_REQUIRED_FIELD' },
      { error: 'Network timeout', code: 'TIMEOUT' },
      { hint: 'Check your credentials', code: 'INVALID_JWT' },
      'Simple string error',
      { someField: 'value', nested: { data: 'test' } }, // Object without message
      null,
      undefined,
      { code: 'PGRST116' }, // Supabase table not found
      { code: '401' }, // HTTP 401
    ]

    errors.forEach((error, index) => {
      const message = getErrorMessage(error)
      console.log(`Error ${index + 1}:`, { original: error, message })
      
      if (index < 3) {
        toast.info(`Test ${index + 1}: ${message}`)
      }
    })
  }

  const testOperationMessages = () => {
    const operations = ['load', 'save', 'delete', 'update']
    const error = new Error('Network connection failed')
    
    operations.forEach(op => {
      const message = createOperationErrorMessage(op, error)
      console.log(`${op} operation:`, message)
    })
    
    toast.info('Check console for operation messages')
  }

  const testErrorClassification = () => {
    const errors = [
      new Error('JWT token expired'),
      new Error('Network connection failed'),
      new Error('Permission denied'),
      { message: 'Fetch failed', code: 'NETWORK_ERROR' },
      { message: 'Unauthorized access', code: 'INVALID_JWT' }
    ]

    errors.forEach((error, index) => {
      const message = getErrorMessage(error)
      const isNetwork = isNetworkError(error)
      const isAuth = isAuthError(error)
      
      console.log(`Error ${index + 1}:`, {
        message,
        isNetwork,
        isAuth,
        original: error
      })
    })

    toast.info('Check console for error classifications')
  }

  const testSupabaseError = () => {
    // Simulate Supabase error structure
    const supabaseError = {
      message: 'relation "beneficiaries" does not exist',
      details: 'The table you are trying to access was not found',
      hint: 'Check if migrations have been run',
      code: 'PGRST116'
    }

    const message = getErrorMessage(supabaseError)
    logErrorSafely('Supabase test error', supabaseError)
    toast.error(message)
  }

  const testObjectError = () => {
    // This would previously show [object Object]
    const objectError = {
      someProperty: 'value',
      nestedData: { 
        id: 123, 
        items: ['a', 'b', 'c'] 
      }
    }

    const message = getErrorMessage(objectError)
    logErrorSafely('Object error test', objectError)
    toast.warning(`Object error handled: ${message}`)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Error Handling Test Page</h1>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Basic Error Message Extraction</h2>
          <p className="text-sm text-gray-600 mb-3">
            Tests various error formats to ensure proper message extraction
          </p>
          <button 
            onClick={testErrorMessages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Error Messages
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Operation Error Messages</h2>
          <p className="text-sm text-gray-600 mb-3">
            Tests contextual error messages for different operations
          </p>
          <button 
            onClick={testOperationMessages}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Operation Messages
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Error Classification</h2>
          <p className="text-sm text-gray-600 mb-3">
            Tests network, auth, and permission error detection
          </p>
          <button 
            onClick={testErrorClassification}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Test Classifications
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Supabase Error Simulation</h2>
          <p className="text-sm text-gray-600 mb-3">
            Simulates actual Supabase error structure
          </p>
          <button 
            onClick={testSupabaseError}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Test Supabase Error
          </button>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Object Error Test</h2>
          <p className="text-sm text-gray-600 mb-3">
            Tests handling of objects without proper error messages (prevents [object Object])
          </p>
          <button 
            onClick={testObjectError}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Test Object Error
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="text-sm space-y-1">
          <li>• Click each test button to verify error handling</li>
          <li>• Check browser console for detailed logs</li>
          <li>• Verify that no "[object Object]" messages appear</li>
          <li>• All error messages should be user-friendly in Turkish</li>
        </ul>
      </div>
    </div>
  )
}

export default ErrorHandlingTest
