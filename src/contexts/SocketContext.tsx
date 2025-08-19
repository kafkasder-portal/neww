import { createContext, useContext, useState, type ReactNode } from 'react'

/**
 * Mock WebSocket bağlantısını yöneten context (Frontend-only)
 */

interface MockSocket {
  emit: (event: string, data?: any) => void
  on: (event: string, callback: (data: any) => void) => void
  off: (event: string, callback?: (data: any) => void) => void
}

interface SocketContextType {
  socket: MockSocket | null
  isConnected: boolean
  connectionError: string | null
  reconnectAttempts: number
  emit: (event: string, data?: any) => void
  on: (event: string, callback: (data: any) => void) => void
  off: (event: string, callback?: (data: any) => void) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

interface SocketProviderProps {
  children: ReactNode
  serverUrl?: string
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [isConnected] = useState(false)
  const [connectionError] = useState<string | null>(null)
  const [reconnectAttempts] = useState(0)

  const emit = (event: string, data?: any) => {
    console.log('Mock socket emit:', event, data)
  }

  const on = (event: string, _callback: (data: any) => void) => {
    console.log('Mock socket on:', event)
  }

  const off = (event: string, _callback?: (data: any) => void) => {
    console.log('Mock socket off:', event)
  }

  const mockSocket: MockSocket = {
    emit,
    on,
    off
  }

  const value: SocketContextType = {
    socket: mockSocket,
    isConnected,
    connectionError,
    reconnectAttempts,
    emit,
    on,
    off
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

/**
 * Socket bağlantı durumunu gösteren hook
 */
export function useSocketStatus() {
  const { isConnected, connectionError, reconnectAttempts } = useSocket()
  
  return {
    isConnected,
    connectionError,
    reconnectAttempts,
    status: isConnected ? 'connected' : connectionError ? 'error' : 'connecting'
  }
}