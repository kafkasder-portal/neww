import { create } from 'zustand'

type PaginationState = {
  page: number
  pageSize: number
  setPage: (page: number) => void
}

export const usePagination = create<PaginationState>((set) => ({
  page: 1,
  pageSize: 20,
  setPage: (page) => set({ page }),
}))

interface UIState {
  sidebarCollapsed: boolean
  isMobileSidebarOpen: boolean
  toggleSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  isMobileSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileSidebarOpen: (open: boolean) => set({ isMobileSidebarOpen: open })
}))


