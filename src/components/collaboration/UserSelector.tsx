import { useState, useEffect } from 'react'
import { Search, Users, Check, X, User } from 'lucide-react'
import { Card } from '../ui/card'

interface UserData {
  id: string
  name: string
  email: string
  avatar_url?: string
  role?: string
  department?: string
  is_online?: boolean
}

interface UserSelectorProps {
  selectedUsers: string[]
  onSelectionChange: (userIds: string[]) => void
  maxSelection?: number
  placeholder?: string
  showOnlineStatus?: boolean
  filterByRole?: string[]
  multiSelect?: boolean
  excludeUsers?: string[]
  size?: 'sm' | 'md' | 'lg'
}

// Mock users data
const mockUsers: UserData[] = [
  {
    id: 'user1',
    name: 'Ahmed Çetin',
    email: 'ahmed@kafkasder.org',
    role: 'Yönetici',
    department: 'Genel Koordinasyon',
    is_online: true
  },
  {
    id: 'user2',
    name: 'Fatma Yılmaz',
    email: 'fatma@kafkasder.org',
    role: 'Mali İşler Uzmanı',
    department: 'Finans',
    is_online: true
  },
  {
    id: 'user3',
    name: 'Mehmet Öztürk',
    email: 'mehmet@kafkasder.org',
    role: 'Proje Koordinatörü',
    department: 'Proje Yönetimi',
    is_online: false
  },
  {
    id: 'user4',
    name: 'Ayşe Kaya',
    email: 'ayse@kafkasder.org',
    role: 'İletişim Uzmanı',
    department: 'İletişim',
    is_online: true
  },
  {
    id: 'user5',
    name: 'Mustafa Demir',
    email: 'mustafa@kafkasder.org',
    role: 'Gönüllü Koordinatörü',
    department: 'Organizasyon',
    is_online: false
  }
]

export default function UserSelector({
  selectedUsers,
  onSelectionChange,
  maxSelection,
  placeholder = 'Kullanıcı seçin...',
  showOnlineStatus = true,
  filterByRole = [],
  multiSelect = true,
  excludeUsers = [],
  size = 'md'
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<UserData[]>([])

  useEffect(() => {
    // Filter users based on props
    let filteredUsers = mockUsers.filter(user => !excludeUsers.includes(user.id))
    
    if (filterByRole.length > 0) {
      filteredUsers = filteredUsers.filter(user => 
        user.role && filterByRole.includes(user.role)
      )
    }
    
    setUsers(filteredUsers)
  }, [excludeUsers, filterByRole])

  const filteredUsers = users.filter((user: UserData) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUserSelect = (userId: string) => {
    if (!multiSelect) {
      onSelectionChange([userId])
      setIsOpen(false)
      return
    }

    if (selectedUsers.includes(userId)) {
      onSelectionChange(selectedUsers.filter(id => id !== userId))
    } else {
      if (maxSelection && selectedUsers.length >= maxSelection) {
        return
      }
      onSelectionChange([...selectedUsers, userId])
    }
  }

  const handleRemoveUser = (userId: string) => {
    onSelectionChange(selectedUsers.filter(id => id !== userId))
  }

  const getSelectedUsersDisplay = () => {
    const selected = users.filter(user => selectedUsers.includes(user.id))
    
    if (selected.length === 0) {
      return placeholder
    }
    
    if (selected.length === 1) {
      return selected[0].name
    }
    
    return `${selected.length} kullanıcı seçildi`
  }

  const getUserAvatar = (user: UserData) => {
    if (user.avatar_url) {
      return (
        <img
          src={user.avatar_url}
          alt={user.name}
          className={`rounded-full object-cover ${
            size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'
          }`}
        />
      )
    }
    
    return (
      <div className={`bg-primary rounded-full flex items-center justify-center text-white font-medium ${
        size === 'sm' ? 'w-6 h-6 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm'
      }`}>
        {user.name.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Selected Users Display */}
      {selectedUsers.length > 0 && multiSelect && (
        <div className="mb-2 flex flex-wrap gap-2">
          {users
            .filter(user => selectedUsers.includes(user.id))
            .map(user => (
              <div
                key={user.id}
                className="flex items-center space-x-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {getUserAvatar(user)}
                <span>{user.name}</span>
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between border border-input rounded-md bg-background hover:bg-accent transition-colors ${
          size === 'sm' ? 'px-2 py-1 text-sm' : size === 'lg' ? 'px-4 py-3 text-base' : 'px-3 py-2'
        }`}
      >
        <div className="flex items-center space-x-2">
          {multiSelect ? (
            <Users className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
          ) : (
            <User className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
          )}
          <span className={selectedUsers.length === 0 ? 'text-muted-foreground' : ''}>
            {getSelectedUsersDisplay()}
          </span>
        </div>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute top-full left-0 right-0 mt-1 z-20 max-h-80 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md text-sm"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                <div className="p-1">
                  {filteredUsers.map(user => {
                    const isSelected = selectedUsers.includes(user.id)
                    const isDisabled = Boolean(maxSelection && selectedUsers.length >= maxSelection && !isSelected)
                    
                    return (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelect(user.id)}
                        disabled={isDisabled}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                          isSelected
                            ? 'bg-primary/10 text-primary'
                            : isDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="relative">
                          {getUserAvatar(user)}
                          {showOnlineStatus && (
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${
                              user.is_online ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium truncate">{user.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-primary" />}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {user.email}
                          </div>
                          {user.role && (
                            <div className="text-xs text-muted-foreground">
                              {user.role} • {user.department}
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Kullanıcı bulunamadı</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {maxSelection && (
              <div className="p-3 border-t bg-muted/30">
                <div className="text-xs text-muted-foreground text-center">
                  {selectedUsers.length} / {maxSelection} kullanıcı seçildi
                </div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
