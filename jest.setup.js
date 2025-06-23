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