import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DataTable } from '../DataTable'

describe('DataTable Component', () => {
  const mockData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'active' }
  ]

  const defaultProps = {
    data: mockData,
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' }
    ],
    onRowClick: vi.fn(),
    onSort: vi.fn(),
    onSearch: vi.fn(),
    loading: false,
    sortable: true,
    searchable: true
  }

  it('renders table with data', () => {
    render(<DataTable {...defaultProps} />)

    // Check if table headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()

    // Check if data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('active')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<DataTable {...defaultProps} loading={true} />)

    expect(screen.getByText('Yükleniyor...')).toBeInTheDocument()
  })

  it('handles empty data', () => {
    render(<DataTable {...defaultProps} data={[]} />)

    expect(screen.getByText('Kayıt bulunamadı.')).toBeInTheDocument()
  })

  it('calls onRowClick when row is clicked', () => {
    render(<DataTable {...defaultProps} />)

    const firstRow = screen.getByText('John Doe').closest('tr')
    fireEvent.click(firstRow!)

    expect(defaultProps.onRowClick).toHaveBeenCalledWith(mockData[0])
  })

  it('calls onSort when sortable column header is clicked', () => {
    render(<DataTable {...defaultProps} />)

    const nameHeader = screen.getByText('Name')
    fireEvent.click(nameHeader)

    expect(defaultProps.onSort).toHaveBeenCalledWith('name', 'asc')
  })

  it('does not call onSort for non-sortable columns', () => {
    render(<DataTable {...defaultProps} />)

    const statusHeader = screen.getByText('Status')
    fireEvent.click(statusHeader)

    expect(defaultProps.onSort).not.toHaveBeenCalled()
  })

  it('handles search input', () => {
    render(<DataTable {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText('Ara...')
    fireEvent.change(searchInput, { target: { value: 'john' } })

    expect(defaultProps.onSearch).toHaveBeenCalledWith('john')
  })

  it('shows pagination when enabled', () => {
    const propsWithPagination = {
      ...defaultProps,
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 25,
        itemsPerPage: 10,
        onPageChange: vi.fn()
      }
    }

    render(<DataTable {...propsWithPagination} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onPageChange when pagination is clicked', () => {
    const propsWithPagination = {
      ...defaultProps,
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 25,
        itemsPerPage: 10,
        onPageChange: vi.fn()
      }
    }

    render(<DataTable {...propsWithPagination} />)

    const page2Button = screen.getByText('2')
    fireEvent.click(page2Button)

    expect(propsWithPagination.pagination.onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables sorting when sortable is false', () => {
    render(<DataTable {...defaultProps} sortable={false} />)

    const nameHeader = screen.getByText('Name')
    fireEvent.click(nameHeader)

    expect(defaultProps.onSort).not.toHaveBeenCalled()
  })

  it('handles custom cell renderer', () => {
    const customColumns = [
      { key: 'name', label: 'Name' },
      { 
        key: 'status', 
        label: 'Status',
        render: (value: string) => (
          <span className={`status-${value}`}>{value}</span>
        )
      }
    ]

    render(<DataTable {...defaultProps} columns={customColumns} />)

    expect(screen.getByText('active')).toHaveClass('status-active')
  })

  it('handles keyboard navigation', () => {
    render(<DataTable {...defaultProps} />)

    const firstRow = screen.getByText('John Doe').closest('tr')
    fireEvent.keyDown(firstRow!, { key: 'Enter' })

    expect(defaultProps.onRowClick).toHaveBeenCalledWith(mockData[0])
  })

  it('shows correct item count in pagination info', () => {
    const propsWithPagination = {
      ...defaultProps,
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 25,
        itemsPerPage: 10,
        onPageChange: vi.fn()
      }
    }

    render(<DataTable {...propsWithPagination} />)

    expect(screen.getByText(/1-10 of 25/)).toBeInTheDocument()
  })

  it('handles large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i.toString(),
      name: `User ${i}`,
      email: `user${i}@example.com`,
      status: 'active'
    }))

    render(<DataTable {...defaultProps} data={largeDataset} />)

    // Should only render visible rows
    expect(screen.getByText('User 0')).toBeInTheDocument()
    expect(screen.queryByText('User 999')).not.toBeInTheDocument()
  })
})
