import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NavMain } from '@/components/nav-main'
import { SidebarProvider } from '@/components/ui/sidebar'

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
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
        localStorageMock.getItem.mockClear()
        localStorageMock.setItem.mockClear()
    })

    it('should initialize with default states when no saved state exists', () => {
        localStorageMock.getItem.mockReturnValue(null)

        renderNavMain()

        // Both menus should be closed by default since isActive is false
        expect(screen.getByText('Playground')).toBeInTheDocument()
        expect(screen.getByText('Demo')).toBeInTheDocument()
    })

    it('should load saved menu states from localStorage', () => {
        const savedState = { Playground: true, Demo: false }
        localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState))

        renderNavMain()

        // Playground should be open, Demo should be closed
        expect(screen.getByText('History')).toBeInTheDocument() // Submenu item visible
        expect(screen.queryByText('Posts CRUD')).not.toBeInTheDocument() // Submenu item not visible
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
    })

    it('should handle invalid JSON in localStorage', () => {
        localStorageMock.getItem.mockReturnValue('invalid json')

        // Should not throw error and should render with default states
        expect(() => renderNavMain()).not.toThrow()
    })
}) 