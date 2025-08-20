import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DataTable } from '../DataTable'

// Mock data for testing
const mockData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'active' }
]

const mockColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', sortable: false }
]

describe('DataTable Component', () => {
    const defaultProps = {
        data: mockData,
        columns: mockColumns,
        onRowClick: vi.fn(),
        onSort: vi.fn(),
        onPageChange: vi.fn(),
        onSearch: vi.fn(),
        loading: false,
        searchable: true,
        sortable: true,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: mockData.length,
            itemsPerPage: 10
        }
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders table with data', () => {
        render(<DataTable {...defaultProps} />)

        // Check if table headers are rendered
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Email')).toBeInTheDocument()
        expect(screen.getByText('Status')).toBeInTheDocument()

        // Check if data rows are rendered
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('jane@example.com')).toBeInTheDocument()
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })

    it('shows loading state', () => {
        render(<DataTable {...defaultProps} loading={true} />)

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('handles empty data', () => {
        render(<DataTable {...defaultProps} data={[]} />)

        expect(screen.getByText('Veri bulunamadı')).toBeInTheDocument()
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

    it('handles search input', async () => {
        render(<DataTable {...defaultProps} />)

        const searchInput = screen.getByPlaceholderText('Ara...')
        fireEvent.change(searchInput, { target: { value: 'john' } })

        await waitFor(() => {
            expect(defaultProps.onSearch).toHaveBeenCalledWith('john')
        })
    })

    it('shows pagination when enabled', () => {
        const propsWithPagination = {
            ...defaultProps,
            pagination: {
                currentPage: 1,
                totalPages: 3,
                totalItems: 25,
                itemsPerPage: 10
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
                itemsPerPage: 10
            }
        }

        render(<DataTable {...propsWithPagination} />)

        const page2Button = screen.getByText('2')
        fireEvent.click(page2Button)

        expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
    })

    it('disables search when searchable is false', () => {
        render(<DataTable {...defaultProps} searchable={false} />)

        expect(screen.queryByPlaceholderText('Ara...')).not.toBeInTheDocument()
    })

    it('disables sorting when sortable is false', () => {
        render(<DataTable {...defaultProps} sortable={false} />)

        const nameHeader = screen.getByText('Name')
        fireEvent.click(nameHeader)

        expect(defaultProps.onSort).not.toHaveBeenCalled()
    })

    it('renders custom cell renderer', () => {
        const columnsWithRenderer = [
            { key: 'name', label: 'Name', sortable: true },
            {
                key: 'status',
                label: 'Status',
                sortable: false,
                render: (value: string) => (
                    <span className={`status-${value}`}>{value}</span>
                )
            }
        ]

        render(<DataTable {...defaultProps} columns={columnsWithRenderer} />)

        const statusElements = screen.getAllByText(/active|inactive/)
        expect(statusElements).toHaveLength(3)
    })

    it('handles keyboard navigation', () => {
        render(<DataTable {...defaultProps} />)

        const firstRow = screen.getByText('John Doe').closest('tr')
        firstRow?.focus()

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
                itemsPerPage: 10
            }
        }

        render(<DataTable {...propsWithPagination} />)

        expect(screen.getByText(/1-10 of 25/)).toBeInTheDocument()
    })

    it('handles large datasets efficiently', () => {
        const largeData = Array.from({ length: 1000 }, (_, i) => ({
            id: String(i),
            name: `User ${i}`,
            email: `user${i}@example.com`,
            status: i % 2 === 0 ? 'active' : 'inactive'
        }))

        render(<DataTable {...defaultProps} data={largeData} />)

        // Should only render visible rows
        expect(screen.getByText('User 0')).toBeInTheDocument()
        expect(screen.queryByText('User 999')).not.toBeInTheDocument()
    })
})
