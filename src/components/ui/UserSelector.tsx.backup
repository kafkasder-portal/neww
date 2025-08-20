import { useState, useEffect } from 'react'
import { Search, X, User, Check } from 'lucide-react'
import { useUserManagement } from '@/hooks/useUserManagement'

interface UserSelectorProps {
  selectedUserIds: string[]
  onSelectionChange: (userIds: string[]) => void
  placeholder?: string
  excludeUserIds?: string[]
  maxSelections?: number
  className?: string
}

export function UserSelector({
  selectedUserIds,
  onSelectionChange,
  placeholder = "Kullanıcı ara...",
  excludeUserIds = [],
  maxSelections,
  className = ""
}: UserSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { users, isLoading, search } = useUserManagement()

  useEffect(() => {
    if (searchTerm.trim()) {
      search.setSearchQuery(searchTerm)
    }
  }, [searchTerm, search])

  const filteredUsers = users.filter(user => {
    if (!searchTerm.trim()) return false
    
    return (
      !excludeUserIds.includes(user.id) &&
      (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  const selectedUsers = users.filter(user => selectedUserIds.includes(user.id))

  const handleUserToggle = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      // Remove user
      onSelectionChange(selectedUserIds.filter(id => id !== userId))
    } else {
      // Add user (check max limit)
      if (!maxSelections || selectedUserIds.length < maxSelections) {
        onSelectionChange([...selectedUserIds, userId])
      }
    }
  }

  const handleRemoveUser = (userId: string) => {
    onSelectionChange(selectedUserIds.filter(id => id !== userId))
  }

  return (
    <div className={`relative ${className}`}>
      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedUsers.map(user => (
            <div
              key={user.id}
              className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
            >
              <User className="h-3 w-3" />
              <span>{user.full_name || user.email}</span>
              <button
                type="button"
                onClick={() => handleRemoveUser(user.id)}
                className="hover:bg-blue-200 rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isLoading && (
              <div className="p-3 text-center text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                <span className="ml-2">Aranıyor...</span>
              </div>
            )}
            
            {!isLoading && filteredUsers.length === 0 && searchTerm && (
              <div className="p-3 text-center text-gray-500">
                Kullanıcı bulunamadı
              </div>
            )}
            
            {!isLoading && filteredUsers.length === 0 && !searchTerm && (
              <div className="p-3 text-center text-gray-500">
                Aramaya başlamak için yazın
              </div>
            )}

            {!isLoading && filteredUsers.map(user => {
              const isSelected = selectedUserIds.includes(user.id)
              const isDisabled = Boolean(maxSelections && !isSelected && selectedUserIds.length >= maxSelections)
              
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => !isDisabled && handleUserToggle(user.id)}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-blue-50 text-blue-700' : ''
                  } ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || user.email}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {user.full_name || 'İsimsiz Kullanıcı'}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
      
      {/* Selection Info */}
      {maxSelections && (
        <div className="text-xs text-gray-500 mt-1">
          {selectedUserIds.length} / {maxSelections} kullanıcı seçildi
        </div>
      )}
    </div>
  )
}