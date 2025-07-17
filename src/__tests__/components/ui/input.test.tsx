import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
    describe('Rendering', () => {
        it('renders input with default props', () => {
            render(<Input placeholder="Enter text" />)

            const input = screen.getByPlaceholderText('Enter text')
            expect(input).toBeInTheDocument()
            expect(input).toHaveClass('flex', 'h-9', 'w-full')
        })

        it('renders input with custom className', () => {
            render(<Input className="custom-class" placeholder="Custom input" />)

            const input = screen.getByPlaceholderText('Custom input')
            expect(input).toHaveClass('custom-class')
        })

        it('renders input with different types', () => {
            const { rerender } = render(<Input type="text" placeholder="Text input" />)
            expect(screen.getByPlaceholderText('Text input')).toHaveAttribute('type', 'text')

            rerender(<Input type="email" placeholder="Email input" />)
            expect(screen.getByPlaceholderText('Email input')).toHaveAttribute('type', 'email')

            rerender(<Input type="password" placeholder="Password input" />)
            expect(screen.getByPlaceholderText('Password input')).toHaveAttribute('type', 'password')

            rerender(<Input type="number" placeholder="Number input" />)
            expect(screen.getByPlaceholderText('Number input')).toHaveAttribute('type', 'number')
        })

        it('renders disabled input', () => {
            render(<Input disabled placeholder="Disabled input" />)

            const input = screen.getByPlaceholderText('Disabled input')
            expect(input).toBeDisabled()
        })

        it('renders read-only input', () => {
            render(<Input readOnly placeholder="Read-only input" />)

            const input = screen.getByPlaceholderText('Read-only input')
            expect(input).toHaveAttribute('readonly')
        })

        it('renders input with value', () => {
            render(<Input value="Test value" onChange={() => { }} placeholder="Input with value" />)

            const input = screen.getByPlaceholderText('Input with value')
            expect(input).toHaveValue('Test value')
        })
    })

    describe('Interactions', () => {
        it('handles input changes', async () => {
            const user = userEvent.setup()
            render(<Input placeholder="Type here" />)

            const input = screen.getByPlaceholderText('Type here')
            await user.type(input, 'Hello, World!')

            expect(input).toHaveValue('Hello, World!')
        })

        it('handles onChange callback', async () => {
            const handleChange = jest.fn()
            const user = userEvent.setup()

            render(<Input onChange={handleChange} placeholder="Test input" />)

            const input = screen.getByPlaceholderText('Test input')
            await user.type(input, 'test')

            expect(handleChange).toHaveBeenCalledTimes(4) // Once for each character
        })

        it('handles onFocus and onBlur events', async () => {
            const handleFocus = jest.fn()
            const handleBlur = jest.fn()
            const user = userEvent.setup()

            render(
                <Input
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Focus test"
                />
            )

            const input = screen.getByPlaceholderText('Focus test')

            await user.click(input)
            expect(handleFocus).toHaveBeenCalledTimes(1)

            await user.tab()
            expect(handleBlur).toHaveBeenCalledTimes(1)
        })

        it('handles keyboard events', async () => {
            const handleKeyDown = jest.fn()
            const handleKeyUp = jest.fn()
            const user = userEvent.setup()

            render(
                <Input
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    placeholder="Keyboard test"
                />
            )

            const input = screen.getByPlaceholderText('Keyboard test')
            await user.type(input, 'a')

            expect(handleKeyDown).toHaveBeenCalled()
            expect(handleKeyUp).toHaveBeenCalled()
        })
    })

    describe('Form Integration', () => {
        it('works with form submission', async () => {
            const handleSubmit = jest.fn((e) => e.preventDefault())
            const user = userEvent.setup()

            render(
                <form onSubmit={handleSubmit}>
                    <Input name="test" placeholder="Form input" />
                    <button type="submit">Submit</button>
                </form>
            )

            const input = screen.getByPlaceholderText('Form input')
            const submitButton = screen.getByRole('button', { name: /submit/i })

            await user.type(input, 'test value')
            await user.click(submitButton)

            expect(handleSubmit).toHaveBeenCalled()
        })

        it('supports form validation attributes', () => {
            render(
                <Input
                    required
                    minLength={3}
                    maxLength={10}
                    pattern="[A-Za-z]+"
                    placeholder="Validation test"
                />
            )

            const input = screen.getByPlaceholderText('Validation test')
            expect(input).toHaveAttribute('required')
            expect(input).toHaveAttribute('minlength', '3')
            expect(input).toHaveAttribute('maxlength', '10')
            expect(input).toHaveAttribute('pattern', '[A-Za-z]+')
        })
    })

    describe('Accessibility', () => {
        it('supports aria-label', () => {
            render(<Input aria-label="Search input" placeholder="Search" />)

            const input = screen.getByLabelText('Search input')
            expect(input).toBeInTheDocument()
        })

        it('supports aria-describedby', () => {
            render(
                <div>
                    <Input aria-describedby="input-help" placeholder="Help input" />
                    <div id="input-help">This input requires help</div>
                </div>
            )

            const input = screen.getByPlaceholderText('Help input')
            expect(input).toHaveAttribute('aria-describedby', 'input-help')
        })

        it('supports aria-invalid', () => {
            render(<Input aria-invalid="true" placeholder="Invalid input" />)

            const input = screen.getByPlaceholderText('Invalid input')
            expect(input).toHaveAttribute('aria-invalid', 'true')
        })

        it('supports aria-required', () => {
            render(<Input aria-required="true" placeholder="Required input" />)

            const input = screen.getByPlaceholderText('Required input')
            expect(input).toHaveAttribute('aria-required', 'true')
        })
    })

    describe('Edge Cases', () => {
        it('handles empty value', () => {
            render(<Input value="" onChange={() => { }} placeholder="Empty input" />)

            const input = screen.getByPlaceholderText('Empty input')
            expect(input).toHaveValue('')
        })

        it('handles undefined value', () => {
            render(<Input value={undefined} placeholder="Undefined input" />)

            const input = screen.getByPlaceholderText('Undefined input')
            expect(input).toBeInTheDocument()
        })

        it('handles very long input', async () => {
            const user = userEvent.setup()
            render(<Input placeholder="Long input" />)

            const input = screen.getByPlaceholderText('Long input')
            const longText = 'a'.repeat(1000)

            await user.type(input, longText)
            expect(input).toHaveValue(longText)
        }, 10000) // Increase timeout to 10 seconds

        it('handles special characters', async () => {
            const user = userEvent.setup()
            render(<Input placeholder="Special chars" />)

            const input = screen.getByPlaceholderText('Special chars')
            const specialText = '!@#$%^&*()_+-=<>?'

            // Type each character individually to avoid issues with special characters
            for (const char of specialText) {
                await user.type(input, char)
            }

            expect(input).toHaveValue(specialText)
        })
    })

    describe('Styling and Classes', () => {
        it('applies default styling classes', () => {
            render(<Input placeholder="Styled input" />)

            const input = screen.getByPlaceholderText('Styled input')
            expect(input).toHaveClass('flex', 'h-9', 'w-full')
        })

        it('applies disabled styling', () => {
            render(<Input disabled placeholder="Disabled styled" />)

            const input = screen.getByPlaceholderText('Disabled styled')
            expect(input).toHaveClass('disabled:pointer-events-none', 'disabled:cursor-not-allowed')
        })

        it('applies focus styling', () => {
            render(<Input placeholder="Focus styled" />)

            const input = screen.getByPlaceholderText('Focus styled')
            expect(input).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50')
        })
    })
}) 