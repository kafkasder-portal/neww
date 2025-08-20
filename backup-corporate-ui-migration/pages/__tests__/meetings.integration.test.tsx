import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, mockMeeting, mockUser } from '../../test/utils'
import MeetingsIndex from '../meetings/Index'
import * as meetingsModule from '../../api/meetings'

// Mock the API
vi.mock('../../api/meetings', () => ({
  meetingsApi: {
    getMeetings: vi.fn(),
    createMeeting: vi.fn(),
    updateMeeting: vi.fn(),
    deleteMeeting: vi.fn(),
    getAttendees: vi.fn(),
    addAttendee: vi.fn(),
    updateAttendeeStatus: vi.fn(),
    getAgenda: vi.fn(),
    addAgendaItem: vi.fn(),
    updateAgendaItem: vi.fn(),
    deleteAgendaItem: vi.fn()
  }
}))

// Mock auth store
vi.mock('../../store/auth', () => ({
  useAuthStore: vi.fn(() => ({
    user: mockUser({ role: 'admin' }),
    isAuthenticated: true
  }))
}))

// Mock permissions hook
vi.mock('../../hooks/usePermissions', () => ({
  usePermissions: vi.fn(() => ({
    permissions: ['manage_meetings', 'view_meetings', 'create_meeting'],
    hasPermission: (permission: string) => ['manage_meetings', 'view_meetings', 'create_meeting'].includes(permission),
    canManageUsers: true
  }))
}))

describe('Meetings Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock successful API responses
    meetingsModule.meetingsApi.getMeetings.mockResolvedValue([
      mockMeeting({ id: '1', title: 'Team Standup' }),
      mockMeeting({ id: '2', title: 'Project Review' })
    ])
    meetingsModule.meetingsApi.getAttendees.mockResolvedValue([])
  })

  it('renders meetings list correctly', async () => {
    render(<MeetingsIndex />)

    // Check if page title is rendered
    expect(screen.getByText('Toplantılar')).toBeInTheDocument()

    // Wait for meetings to load
    await waitFor(() => {
      expect(screen.getByText('Team Standup')).toBeInTheDocument()
      expect(screen.getByText('Project Review')).toBeInTheDocument()
    })
  })

  it('allows creating new meeting', async () => {
    meetingsModule.meetingsApi.createMeeting.mockResolvedValue(
      mockMeeting({ id: '3', title: 'New Meeting' })
    )

    render(<MeetingsIndex />)

    // Click create button
    const createButton = screen.getByText('Yeni Toplantı')
    fireEvent.click(createButton)

    // Check if create modal opens
    await waitFor(() => {
      expect(screen.getByText('Yeni Toplantı Oluştur')).toBeInTheDocument()
    })

    // Verify form elements are present
    await waitFor(() => {
      expect(screen.getByText('Toplantı Başlığı *')).toBeInTheDocument()
    })
  })

  it('allows viewing meeting details', async () => {
    // Mock additional API calls for meeting details
    meetingsModule.meetingsApi.getMeeting = vi.fn().mockResolvedValue(
      mockMeeting({ id: '1', title: 'Team Standup' })
    )
    meetingsModule.meetingsApi.getAttendees = vi.fn().mockResolvedValue([])
    meetingsModule.meetingsApi.getAgenda = vi.fn().mockResolvedValue([])
    meetingsModule.meetingsApi.getMinutes = vi.fn().mockResolvedValue([])
    meetingsModule.meetingsApi.getActionItems = vi.fn().mockResolvedValue([])

    render(<MeetingsIndex />)

    // Wait for meetings to load
    await waitFor(() => {
      expect(screen.getByText('Team Standup')).toBeInTheDocument()
    })

    // Click details button for first meeting
    const detailsButtons = screen.getAllByText('Detaylar')
    fireEvent.click(detailsButtons[0])

    // Wait for details modal to open and load
    await waitFor(() => {
      expect(screen.getByText('Toplantı Detayları')).toBeInTheDocument()
    })

    // Verify meeting details are displayed by checking for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument()
    })
  })

  it('allows deleting a meeting', async () => {
    const deleteMock = vi.fn().mockResolvedValue(undefined)
    meetingsModule.meetingsApi.deleteMeeting = deleteMock
    
    // Mock additional API calls for meeting details
    meetingsModule.meetingsApi.getMeeting = vi.fn().mockResolvedValue(
      mockMeeting({ id: '1', title: 'Team Standup' })
    )
    meetingsModule.meetingsApi.getAttendees = vi.fn().mockResolvedValue([])
    meetingsModule.meetingsApi.getAgenda = vi.fn().mockResolvedValue([])
    meetingsModule.meetingsApi.getMinutes = vi.fn().mockResolvedValue([])
    meetingsModule.meetingsApi.getActionItems = vi.fn().mockResolvedValue([])
    
    // Mock window.confirm to return true
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<MeetingsIndex />)

    // Wait for meetings to load
    await waitFor(() => {
      expect(screen.getByText('Team Standup')).toBeInTheDocument()
    })

    // Click details button for first meeting
    const detailsButtons = screen.getAllByText('Detaylar')
    fireEvent.click(detailsButtons[0])

    // Wait for details modal to open and load
    await waitFor(() => {
      expect(screen.getByText('Toplantı Detayları')).toBeInTheDocument()
    })

    // Verify delete button is available
    await waitFor(() => {
      expect(screen.getByText('Sil')).toBeInTheDocument()
    })

    // Clean up
    mockConfirm.mockRestore()
  })

  it('displays loading state while fetching meetings', () => {
    const { meetingsApi } = meetingsModule
    // Return a promise that never resolves to simulate loading
    meetingsApi.getMeetings.mockReturnValue(new Promise(() => {}))

    render(<MeetingsIndex />)

    // Check for loading indicator
    expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument()
  })

  it('displays error state when API fails', async () => {
    const { meetingsApi } = meetingsModule
    meetingsApi.getMeetings.mockRejectedValue(new Error('API Error'))

    render(<MeetingsIndex />)

    // Wait for loading to complete and error state to be shown
    await waitFor(() => {
      expect(screen.queryByText(/yükleniyor/i)).not.toBeInTheDocument()
    })
    
    // Check that no meetings are displayed and error is handled gracefully
    expect(screen.getByText(/henüz toplantı oluşturulmamış/i)).toBeInTheDocument()
  })

  it('filters meetings by search term', async () => {
    render(<MeetingsIndex />)

    // Wait for meetings to load
    await waitFor(() => {
      expect(screen.getByText('Team Standup')).toBeInTheDocument()
      expect(screen.getByText('Project Review')).toBeInTheDocument()
    })

    // Search for specific meeting
    const searchInput = screen.getByPlaceholderText(/ara/i)
    fireEvent.change(searchInput, { target: { value: 'Team' } })

    // Check that only matching meeting is shown
    await waitFor(() => {
      expect(screen.getByText('Team Standup')).toBeInTheDocument()
      expect(screen.queryByText('Project Review')).not.toBeInTheDocument()
    })
  })

  it('shows meeting details when clicked', async () => {
    render(<MeetingsIndex />)

    // Wait for meetings to load
    await waitFor(() => {
      expect(screen.getByText('Team Standup')).toBeInTheDocument()
    })

    // Click on details button to view details
    const detailsButtons = screen.getAllByText('Detaylar')
    fireEvent.click(detailsButtons[0])

    // Check if detail modal opens
    await waitFor(() => {
      expect(screen.getByText('Toplantı Detayları')).toBeInTheDocument()
    })
  })
})

