import { memo } from 'react'
import { useLocation } from 'react-router-dom'
import { allPages } from '../constants/navigation'
import { cn } from '../lib/utils'
import { SidebarTrigger, useSidebar } from './ui/sidebar'

interface AppHeaderProps {
  className?: string
}

const AppHeader = memo(function AppHeader({ className }: AppHeaderProps) {
  return null
})

export { AppHeader }
