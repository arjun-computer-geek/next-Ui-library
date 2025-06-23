import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
    describe('Rendering', () => {
        it('renders button with default props', () => {
            render(<Button>Click me</Button>)

            const button = screen.getByRole('button', { name: /click me/i })
            expect(button).toBeInTheDocument()
            expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
        })

        it('renders button with custom className', () => {
            render(<Button className="custom-class">Custom Button</Button>)

            const button = screen.getByRole('button', { name: /custom button/i })
            expect(button).toHaveClass('custom-class')
        })

        it('renders button with different variants', () => {
            const { rerender } = render(<Button variant="default">Default</Button>)
            expect(screen.getByRole('button')).toHaveClass('bg-primary', 'text-primary-foreground')

            rerender(<Button variant="destructive">Destructive</Button>)
            expect(screen.getByRole('button')).toHaveClass('bg-destructive', 'text-white')

            rerender(<Button variant="outline">Outline</Button>)
            expect(screen.getByRole('button')).toHaveClass('border', 'bg-background')

            rerender(<Button variant="secondary">Secondary</Button>)
            expect(screen.getByRole('button')).toHaveClass('bg-secondary', 'text-secondary-foreground')

            rerender(<Button variant="ghost">Ghost</Button>)
            expect(screen.getByRole('button')).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')

            rerender(<Button variant="link">Link</Button>)
            expect(screen.getByRole('button')).toHaveClass('text-primary', 'underline-offset-4')
        })

        it('renders button with different sizes', () => {
            const { rerender } = render(<Button size="default">Default Size</Button>)
            expect(screen.getByRole('button')).toHaveClass('h-9', 'px-4', 'py-2')

            rerender(<Button size="sm">Small</Button>)
            expect(screen.getByRole('button')).toHaveClass('h-8', 'rounded-md', 'px-3')

            rerender(<Button size="lg">Large</Button>)
            expect(screen.getByRole('button')).toHaveClass('h-10', 'rounded-md', 'px-6')

            rerender(<Button size="icon">Icon</Button>)
            expect(screen.getByRole('button')).toHaveClass('size-9')
        })

        it('renders disabled button', () => {
            render(<Button disabled>Disabled</Button>)

            const button = screen.getByRole('button', { name: /disabled/i })
            expect(button).toBeDisabled()
            expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
        })
    })

    describe('Interactions', () => {
        it('handles click events', async () => {
            const handleClick = jest.fn()
            const user = userEvent.setup()

            render(<Button onClick={handleClick}>Click me</Button>)

            const button = screen.getByRole('button', { name: /click me/i })
            await user.click(button)

            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('does not trigger click when disabled', async () => {
            const handleClick = jest.fn()
            const user = userEvent.setup()

            render(<Button disabled onClick={handleClick}>Disabled</Button>)

            const button = screen.getByRole('button', { name: /disabled/i })
            await user.click(button)

            expect(handleClick).not.toHaveBeenCalled()
        })

        it('handles keyboard interactions', async () => {
            const handleClick = jest.fn()
            const user = userEvent.setup()

            render(<Button onClick={handleClick}>Press Enter</Button>)

            const button = screen.getByRole('button', { name: /press enter/i })
            button.focus()
            await user.keyboard('{Enter}')

            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('handles space key press', async () => {
            const handleClick = jest.fn()
            const user = userEvent.setup()

            render(<Button onClick={handleClick}>Press Space</Button>)

            const button = screen.getByRole('button', { name: /press space/i })
            button.focus()
            await user.keyboard(' ')

            expect(handleClick).toHaveBeenCalledTimes(1)
        })
    })

    describe('Accessibility', () => {
        it('supports aria-label', () => {
            render(<Button aria-label="Close dialog">×</Button>)

            const button = screen.getByRole('button', { name: /close dialog/i })
            expect(button).toBeInTheDocument()
        })

        it('supports aria-describedby', () => {
            render(
                <div>
                    <Button aria-describedby="button-description">Action</Button>
                    <div id="button-description">This button performs an action</div>
                </div>
            )

            const button = screen.getByRole('button', { name: /action/i })
            expect(button).toHaveAttribute('aria-describedby', 'button-description')
        })

        it('supports role attribute', () => {
            render(<Button role="menuitem">Menu Item</Button>)

            const button = screen.getByRole('menuitem', { name: /menu item/i })
            expect(button).toBeInTheDocument()
        })
    })

    describe('Form Integration', () => {
        it('renders as submit button', () => {
            render(<Button type="submit">Submit</Button>)

            const button = screen.getByRole('button', { name: /submit/i })
            expect(button).toHaveAttribute('type', 'submit')
        })

        it('renders as reset button', () => {
            render(<Button type="reset">Reset</Button>)

            const button = screen.getByRole('button', { name: /reset/i })
            expect(button).toHaveAttribute('type', 'reset')
        })
    })

    describe('Children and Content', () => {
        it('renders text content', () => {
            render(<Button>Simple text</Button>)

            expect(screen.getByRole('button', { name: /simple text/i })).toBeInTheDocument()
        })

        it('renders complex children', () => {
            render(
                <Button>
                    <span>Icon</span>
                    <span>Text</span>
                </Button>
            )

            const button = screen.getByRole('button')
            expect(button).toHaveTextContent('Icon')
            expect(button).toHaveTextContent('Text')
        })

        it('renders with icons', () => {
            render(
                <Button>
                    <svg data-testid="icon" />
                    Button with icon
                </Button>
            )

            expect(screen.getByTestId('icon')).toBeInTheDocument()
            expect(screen.getByRole('button')).toHaveTextContent('Button with icon')
        })
    })

    describe('Edge Cases', () => {
        it('handles empty children', () => {
            render(<Button></Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
            expect(button).toHaveTextContent('')
        })

        it('handles null children', () => {
            render(<Button>{null}</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })

        it('handles undefined children', () => {
            render(<Button>{undefined}</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
        })

        it('handles boolean children', () => {
            render(<Button>{true}</Button>)

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
            // Boolean values don't render as text in React
            expect(button).toHaveTextContent('')
        })
    })
}) 