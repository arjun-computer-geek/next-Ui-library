import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NavMain } from '@/components/nav-main'
import { SidebarProvider } from '@/components/ui/sidebar'

// Mock localStorage with proper implementation
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
}

// Mock window.localStorage
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
})

const mockItems = [
    {
        title: "Playground",
        url: "#",
        isActive: false,
        items: [
            { title: "History", url: "#" },
            { title: "Starred", url: "#" },
        ],
    },
    {
        title: "Demo",
        url: "/demo",
        isActive: false,
        items: [
            { title: "Posts CRUD", url: "/demo" },
            { title: "Dynamic Form Generator", url: "/dynamic-form-demo" },
        ],
    },
]

// Helper function to render NavMain with required context
const renderNavMain = (items = mockItems) => {
    return render(
        <SidebarProvider>
            <NavMain items={items} />
        </SidebarProvider>
    )
}

describe('NavMain', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks()
        localStorageMock.getItem.mockClear()
        localStorageMock.setItem.mockClear()
    })

    it('should initialize with default states when no saved state exists', () => {
        localStorageMock.getItem.mockReturnValue(null)

        renderNavMain()

        // Both menus should be closed by default since isActive is false
        expect(screen.getByText('Playground')).toBeInTheDocument()
        expect(screen.getByText('Demo')).toBeInTheDocument()

        // Submenu items should not be visible initially
        expect(screen.queryByText('History')).not.toBeInTheDocument()
        expect(screen.queryByText('Posts CRUD')).not.toBeInTheDocument()
    })

    it('should load saved menu states from localStorage', async () => {
        const savedState = { Playground: true, Demo: false }
        localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState))

        renderNavMain()

        // Wait for the component to process the saved state
        await waitFor(() => {
            expect(screen.getByText('History')).toBeInTheDocument() // Submenu item visible
        })

        // Demo submenu should still be closed
        expect(screen.queryByText('Posts CRUD')).not.toBeInTheDocument()
    })

    it('should save menu state to localStorage when toggled', async () => {
        localStorageMock.getItem.mockReturnValue(null)

        renderNavMain()

        // Click on Demo menu to open it
        const demoButton = screen.getByText('Demo')
        fireEvent.click(demoButton)

        await waitFor(() => {
            expect(screen.getByText('Posts CRUD')).toBeInTheDocument()
        })

        // Verify localStorage was called with the new state
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'sidebar_menu_state',
            JSON.stringify({ Playground: false, Demo: true })
        )
    })

    it('should handle localStorage errors gracefully', () => {
        localStorageMock.getItem.mockImplementation(() => {
            throw new Error('localStorage error')
        })

        // Should not throw error and should render with default states
        expect(() => renderNavMain()).not.toThrow()

        // Component should still render
        expect(screen.getByText('Playground')).toBeInTheDocument()
        expect(screen.getByText('Demo')).toBeInTheDocument()
    })

    it('should handle invalid JSON in localStorage', () => {
        localStorageMock.getItem.mockReturnValue('invalid json')

        // Should not throw error and should render with default states
        expect(() => renderNavMain()).not.toThrow()

        // Component should still render
        expect(screen.getByText('Playground')).toBeInTheDocument()
        expect(screen.getByText('Demo')).toBeInTheDocument()
    })
}) 