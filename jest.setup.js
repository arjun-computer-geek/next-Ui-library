import '@testing-library/jest-dom'

// Extend Jest matchers
expect.extend({
    toBeInTheDocument(received) {
        const pass = received !== null && received !== undefined
        return {
            pass,
            message: () => `expected ${received} to be in the document`,
        }
    },
    toHaveClass(received, ...expectedClasses) {
        const pass = expectedClasses.every(className =>
            received.classList.contains(className)
        )
        return {
            pass,
            message: () => `expected ${received} to have classes ${expectedClasses.join(', ')}`,
        }
    },
})

// Mock Next.js Link component
jest.mock('next/link', () => {
    return function MockLink({ children, href, ...props }) {
        return (
            <a href={href} {...props}>
                {children}
            </a>
        )
    }
})

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        }
    },
    useSearchParams() {
        return new URLSearchParams()
    },
    usePathname() {
        return '/'
    },
}))

// Mock next-themes
jest.mock('next-themes', () => ({
    useTheme: () => ({
        theme: 'light',
        setTheme: jest.fn(),
        themes: ['light', 'dark'],
    }),
    ThemeProvider: ({ children }) => children,
}))

// Mock sonner toast
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
        info: jest.fn(),
    },
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
}) 