"use client"

import * as React from "react"
import { Check, ChevronsUpDown, User } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const userSelectorVariants = cva(
  [
    // Base styles with enhanced UX
    "w-full justify-between",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2 border-border",
        filled: "bg-muted/50",
        ghost: "bg-transparent hover:bg-muted/50",
      },
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        default: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base",
        xl: "h-14 px-6 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
  status?: "online" | "offline" | "away" | "busy"
  department?: string
}

export interface UserSelectorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof userSelectorVariants> {
  users: User[]
  selectedUser?: User
  onUserSelect?: (user: User) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  showAvatar?: boolean
  showEmail?: boolean
  showRole?: boolean
  showStatus?: boolean
  showDepartment?: boolean
  multiple?: boolean
  disabled?: boolean
  loading?: boolean
  error?: string
}

const UserSelector = React.forwardRef<HTMLDivElement, UserSelectorProps>(
  ({ 
    className, 
    variant, 
    size,
    users,
    selectedUser,
    onUserSelect,
    placeholder = "Select user...",
    searchPlaceholder = "Search users...",
    emptyText = "No users found.",
    showAvatar = true,
    showEmail = true,
    showRole = false,
    showStatus = false,
    showDepartment = false,
    multiple = false,
    disabled = false,
    loading = false,
    error,
    ...props 
  }, ref) => {
    const [open, setOpen] = React.useState(false)

    const getStatusColor = (status?: string) => {
      switch (status) {
        case "online":
          return "bg-green-500"
        case "away":
          return "bg-yellow-500"
        case "busy":
          return "bg-red-500"
        default:
          return "bg-gray-400"
      }
    }

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }

    const handleUserSelect = (user: User) => {
      onUserSelect?.(user)
      if (!multiple) {
        setOpen(false)
      }
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                userSelectorVariants({ variant, size }),
                "w-full justify-between",
                error && "border-destructive focus:border-destructive"
              )}
              disabled={disabled || loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Loading...</span>
                </div>
              ) : selectedUser ? (
                <div className="flex items-center space-x-2">
                  {showAvatar && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback className="text-xs">
                        {getInitials(selectedUser.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{selectedUser.name}</span>
                    {showEmail && (
                      <span className="text-xs text-muted-foreground">
                        {selectedUser.email}
                      </span>
                    )}
                  </div>
                  {showStatus && selectedUser.status && (
                    <div className={cn("h-2 w-2 rounded-full", getStatusColor(selectedUser.status))} />
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.name}
                      onSelect={() => handleUserSelect(user)}
                      className="flex items-center space-x-2 p-2"
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        {showAvatar && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{user.name}</span>
                            {showStatus && user.status && (
                              <div className={cn("h-2 w-2 rounded-full", getStatusColor(user.status))} />
                            )}
                          </div>
                          {showEmail && (
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            {showRole && user.role && (
                              <Badge variant="secondary" className="text-xs">
                                {user.role}
                              </Badge>
                            )}
                            {showDepartment && user.department && (
                              <Badge variant="outline" className="text-xs">
                                {user.department}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {selectedUser?.id === user.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
UserSelector.displayName = "UserSelector"

export { UserSelector, userSelectorVariants }