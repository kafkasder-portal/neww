import React, { useState, useEffect } from 'react'
import { useKafkasPortal, validateDomainConnection } from '../lib/kafkasportal'
import { env } from '../lib/env'

interface ConnectionStatus {
  isConnected: boolean
  domain: string
  error?: string
  lastChecked?: Date
}

export const KafkasPortalConnection: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const { baseUrl, webUrl } = useKafkasPortal()

  const checkConnection = async () => {
    setLoading(true)
    try {
      const result = await validateDomainConnection()
      setStatus({
        ...result,
        lastChecked: new Date()
      })
    } catch (error) {
      setStatus({
        isConnected: false,
        domain: baseUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date()
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const handleTestConnection = () => {
    checkConnection()
  }

  const handleOpenPortal = () => {
    window.open(webUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          KAFKASDER Portal Connection
        </h3>
        <button
          onClick={handleTestConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Domain:</span>
          <span className="text-sm text-gray-900">{baseUrl}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                status?.isConnected 
                  ? 'bg-green-500' 
                  : status?.isConnected === false 
                  ? 'bg-red-500' 
                  : 'bg-gray-400'
              }`}
            />
            <span className="text-sm text-gray-900">
              {status?.isConnected 
                ? 'Connected' 
                : status?.isConnected === false 
                ? 'Disconnected' 
                : 'Unknown'
              }
            </span>
          </div>
        </div>

        {status?.error && (
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium text-gray-600">Error:</span>
            <span className="text-sm text-red-600 text-right max-w-xs">
              {status.error}
            </span>
          </div>
        )}

        {status?.lastChecked && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Last Checked:</span>
            <span className="text-sm text-gray-900">
              {status.lastChecked.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Environment:</span>
          <span className={`text-sm px-2 py-1 rounded text-xs font-medium ${
            env.isProduction 
              ? 'bg-green-100 text-green-800' 
              : env.isDevelopment 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {env.APP_ENVIRONMENT}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleOpenPortal}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Open KAFKASDER Portal
        </button>
      </div>

      {env.DEBUG_MODE && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
          <p className="font-medium text-gray-700 mb-1">Debug Info:</p>
          <pre className="text-gray-600">
            {JSON.stringify({
              baseUrl,
              webUrl,
              apiBaseUrl: env.API_BASE_URL,
              appName: env.APP_NAME,
              realtime: env.ENABLE_REALTIME
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default KafkasPortalConnection
