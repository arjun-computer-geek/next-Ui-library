import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

describe('Card Component', () => {
    describe('Card Rendering', () => {
        it('renders card with default props', () => {
            render(<Card>Card content</Card>)

            const card = screen.getByText('Card content')
            expect(card).toBeInTheDocument()
            expect(card.closest('div')).toHaveClass('bg-card', 'text-card-foreground', 'flex', 'flex-col')
        })

        it('renders card with custom className', () => {
            render(<Card className="custom-card">Custom card</Card>)

            const card = screen.getByText('Custom card')
            expect(card.closest('div')).toHaveClass('custom-card')
        })

        it('renders card with children', () => {
            render(
                <Card>
                    <div>Child 1</div>
                    <div>Child 2</div>
                </Card>
            )

            expect(screen.getByText('Child 1')).toBeInTheDocument()
            expect(screen.getByText('Child 2')).toBeInTheDocument()
        })
    })

    describe('CardHeader Rendering', () => {
        it('renders card header with default props', () => {
            render(
                <Card>
                    <CardHeader>Header content</CardHeader>
                </Card>
            )

            const header = screen.getByText('Header content')
            expect(header).toBeInTheDocument()
            expect(header.closest('div')).toHaveClass('grid', 'auto-rows-min', 'grid-rows-[auto_auto]')
        })

        it('renders card header with custom className', () => {
            render(
                <Card>
                    <CardHeader className="custom-header">Custom header</CardHeader>
                </Card>
            )

            const header = screen.getByText('Custom header')
            expect(header.closest('div')).toHaveClass('custom-header')
        })

        it('renders card header with children', () => {
            render(
                <Card>
                    <CardHeader>
                        <div>Header child 1</div>
                        <div>Header child 2</div>
                    </CardHeader>
                </Card>
            )

            expect(screen.getByText('Header child 1')).toBeInTheDocument()
            expect(screen.getByText('Header child 2')).toBeInTheDocument()
        })
    })

    describe('CardTitle Rendering', () => {
        it('renders card title with default props', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                    </CardHeader>
                </Card>
            )

            const title = screen.getByText('Card Title')
            expect(title).toBeInTheDocument()
            expect(title).toHaveClass('leading-none', 'font-semibold')
        })

        it('renders card title with custom className', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle className="custom-title">Custom title</CardTitle>
                    </CardHeader>
                </Card>
            )

            const title = screen.getByText('Custom title')
            expect(title).toHaveClass('custom-title')
        })

        it('renders card title as div element', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Div Title</CardTitle>
                    </CardHeader>
                </Card>
            )

            const title = screen.getByText('Div Title')
            expect(title.tagName).toBe('DIV')
        })
    })

    describe('CardContent Rendering', () => {
        it('renders card content with default props', () => {
            render(
                <Card>
                    <CardContent>Content text</CardContent>
                </Card>
            )

            const content = screen.getByText('Content text')
            expect(content).toBeInTheDocument()
            expect(content.closest('div')).toHaveClass('px-6')
        })

        it('renders card content with custom className', () => {
            render(
                <Card>
                    <CardContent className="custom-content">Custom content</CardContent>
                </Card>
            )

            const content = screen.getByText('Custom content')
            expect(content.closest('div')).toHaveClass('custom-content')
        })

        it('renders card content with complex children', () => {
            render(
                <Card>
                    <CardContent>
                        <p>Paragraph 1</p>
                        <p>Paragraph 2</p>
                        <button>Action button</button>
                    </CardContent>
                </Card>
            )

            expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
            expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Action button' })).toBeInTheDocument()
        })
    })

    describe('Complete Card Structure', () => {
        it('renders complete card with all components', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Complete Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>This is a complete card with header and content.</p>
                    </CardContent>
                </Card>
            )

            expect(screen.getByText('Complete Card')).toBeInTheDocument()
            expect(screen.getByText('This is a complete card with header and content.')).toBeInTheDocument()
        })

        it('renders multiple cards', () => {
            render(
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Card 1</CardTitle>
                        </CardHeader>
                        <CardContent>Content 1</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Card 2</CardTitle>
                        </CardHeader>
                        <CardContent>Content 2</CardContent>
                    </Card>
                </div>
            )

            expect(screen.getByText('Card 1')).toBeInTheDocument()
            expect(screen.getByText('Card 2')).toBeInTheDocument()
            expect(screen.getByText('Content 1')).toBeInTheDocument()
            expect(screen.getByText('Content 2')).toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('supports aria-label on card', () => {
            render(<Card aria-label="Information card">Card with aria-label</Card>)

            const card = screen.getByLabelText('Information card')
            expect(card).toBeInTheDocument()
        })

        it('supports role attribute on card', () => {
            render(<Card role="article">Article card</Card>)

            const card = screen.getByRole('article')
            expect(card).toBeInTheDocument()
        })

        it('supports aria-describedby on card', () => {
            render(
                <div>
                    <Card aria-describedby="card-description">Card with description</Card>
                    <div id="card-description">This card contains important information</div>
                </div>
            )

            const card = screen.getByText('Card with description')
            expect(card.closest('div')).toHaveAttribute('aria-describedby', 'card-description')
        })
    })

    describe('Styling and Classes', () => {
        it('applies default card styling', () => {
            render(<Card>Styled card</Card>)

            const card = screen.getByText('Styled card').closest('div')
            expect(card).toHaveClass('bg-card', 'text-card-foreground', 'flex', 'flex-col', 'gap-6', 'rounded-xl', 'border', 'py-6', 'shadow-sm')
        })

        it('applies default header styling', () => {
            render(
                <Card>
                    <CardHeader>Header</CardHeader>
                </Card>
            )

            const header = screen.getByText('Header').closest('div')
            expect(header).toHaveClass('grid', 'auto-rows-min', 'grid-rows-[auto_auto]', 'items-start', 'gap-1.5', 'px-6')
        })

        it('applies default title styling', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Title</CardTitle>
                    </CardHeader>
                </Card>
            )

            const title = screen.getByText('Title')
            expect(title).toHaveClass('leading-none', 'font-semibold')
        })

        it('applies default content styling', () => {
            render(
                <Card>
                    <CardContent>Content</CardContent>
                </Card>
            )

            const content = screen.getByText('Content').closest('div')
            expect(content).toHaveClass('px-6')
        })
    })

    describe('Edge Cases', () => {
        it('handles empty children', () => {
            render(<Card></Card>)

            const card = screen.getByTestId('card')
            expect(card).toBeInTheDocument()
        })

        it('handles null children', () => {
            render(<Card>{null}</Card>)

            const card = screen.getByTestId('card')
            expect(card).toBeInTheDocument()
        })

        it('handles undefined children', () => {
            render(<Card>{undefined}</Card>)

            const card = screen.getByTestId('card')
            expect(card).toBeInTheDocument()
        })

        it('handles boolean children', () => {
            render(<Card>{true}</Card>)

            const card = screen.getByTestId('card')
            expect(card).toBeInTheDocument()
            // Boolean values don't render as text in React
            expect(card).toHaveTextContent('')
        })

        it('handles nested card components', () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Parent Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Card>
                            <CardHeader>
                                <CardTitle>Child Card</CardTitle>
                            </CardHeader>
                            <CardContent>Nested content</CardContent>
                        </Card>
                    </CardContent>
                </Card>
            )

            expect(screen.getByText('Parent Card')).toBeInTheDocument()
            expect(screen.getByText('Child Card')).toBeInTheDocument()
            expect(screen.getByText('Nested content')).toBeInTheDocument()
        })
    })
}) 