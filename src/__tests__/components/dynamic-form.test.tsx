import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynamicForm } from '@/components/dynamic-form';
import { JsonFormSchema } from '@/lib/schema-generator';

// Mock the toast function
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('DynamicForm Component', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    describe('Basic Form Rendering', () => {
        const basicSchema: JsonFormSchema = {
            title: 'Test Form',
            description: 'A test form',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                    label: 'Name',
                    required: true,
                },
                {
                    name: 'email',
                    type: 'email',
                    label: 'Email',
                    required: true,
                },
            ],
        };

        it('renders form with title and description', () => {
            render(<DynamicForm schema={basicSchema} onSubmit={mockOnSubmit} />);

            expect(screen.getByText('Test Form')).toBeInTheDocument();
            expect(screen.getByText('A test form')).toBeInTheDocument();
        });

        it('renders all form fields', () => {
            render(<DynamicForm schema={basicSchema} onSubmit={mockOnSubmit} />);

            expect(screen.getByLabelText('Name *')).toBeInTheDocument();
            expect(screen.getByLabelText('Email *')).toBeInTheDocument();
        });

        it('shows required field indicators', () => {
            render(<DynamicForm schema={basicSchema} onSubmit={mockOnSubmit} />);

            const nameLabel = screen.getByText('Name');
            const emailLabel = screen.getByText('Email');

            expect(nameLabel.parentElement).toHaveTextContent('*');
            expect(emailLabel.parentElement).toHaveTextContent('*');
        });
    });

    describe('Form Validation', () => {
        const validationSchema: JsonFormSchema = {
            title: 'Validation Test',
            fields: [
                {
                    name: 'title',
                    type: 'string',
                    label: 'Title',
                    required: true,
                    minLength: 3,
                    maxLength: 10,
                },
                {
                    name: 'age',
                    type: 'number',
                    label: 'Age',
                    required: true,
                    min: 18,
                    max: 100,
                },
                {
                    name: 'email',
                    type: 'email',
                    label: 'Email',
                    required: true,
                },
            ],
        };

        it('validates required fields', async () => {
            const userEventInstance = userEvent.setup();
            render(<DynamicForm schema={validationSchema} onSubmit={mockOnSubmit} />);

            const submitButton = screen.getByText('Submit');
            await userEventInstance.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Title is required')).toBeInTheDocument();
                expect(screen.getByText('Age is required')).toBeInTheDocument();
                expect(screen.getByText('Email is required')).toBeInTheDocument();
            });
        });

        it('validates minimum length', async () => {
            const userEventInstance = userEvent.setup();
            render(<DynamicForm schema={validationSchema} onSubmit={mockOnSubmit} />);

            const titleInput = screen.getByLabelText('Title *');
            await userEventInstance.type(titleInput, 'ab');

            const submitButton = screen.getByText('Submit');
            await userEventInstance.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
            });
        });

        it('validates maximum length', async () => {
            const user = userEvent.setup();
            render(<DynamicForm schema={validationSchema} onSubmit={mockOnSubmit} />);

            const titleInput = screen.getByLabelText('Title *');
            await user.type(titleInput, 'This is a very long title that exceeds the limit');

            await waitFor(() => {
                expect(screen.getByText('Title must be less than 10 characters')).toBeInTheDocument();
            });
        });

        it('validates email format', async () => {
            const user = userEvent.setup();
            render(<DynamicForm schema={validationSchema} onSubmit={mockOnSubmit} />);

            const emailInput = screen.getByLabelText('Email *');
            await user.type(emailInput, 'invalid-email');

            await waitFor(() => {
                expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
            });
        });

        it('validates number range', async () => {
            const user = userEvent.setup();
            render(<DynamicForm schema={validationSchema} onSubmit={mockOnSubmit} />);

            const ageInput = screen.getByLabelText('Age *');
            await user.type(ageInput, '15');

            await waitFor(() => {
                expect(screen.getByText('Age must be at least 18')).toBeInTheDocument();
            });
        });
    });

    describe('Different Field Types', () => {
        const fieldTypesSchema: JsonFormSchema = {
            title: 'Field Types Test',
            fields: [
                {
                    name: 'text',
                    type: 'string',
                    label: 'Text Input',
                },
                {
                    name: 'textarea',
                    type: 'textarea',
                    label: 'Text Area',
                },
                {
                    name: 'select',
                    type: 'select',
                    label: 'Select Option',
                    options: [
                        { value: 'option1', label: 'Option 1' },
                        { value: 'option2', label: 'Option 2' },
                    ],
                },
                {
                    name: 'multiselect',
                    type: 'multiselect',
                    label: 'Multi Select',
                    options: [
                        { value: 'tag1', label: 'Tag 1' },
                        { value: 'tag2', label: 'Tag 2' },
                    ],
                },
                {
                    name: 'checkbox',
                    type: 'boolean',
                    label: 'Checkbox',
                },
                {
                    name: 'file',
                    type: 'file',
                    label: 'File Upload',
                },
            ],
        };

        it('renders text input correctly', () => {
            render(<DynamicForm schema={fieldTypesSchema} onSubmit={mockOnSubmit} />);

            const textInput = screen.getByLabelText('Text Input');
            expect(textInput).toHaveAttribute('type', 'text');
        });

        it('renders textarea correctly', () => {
            render(<DynamicForm schema={fieldTypesSchema} onSubmit={mockOnSubmit} />);

            const textarea = screen.getByLabelText('Text Area');
            expect(textarea.tagName).toBe('TEXTAREA');
        });

        it('renders select dropdown correctly', () => {
            render(<DynamicForm schema={fieldTypesSchema} onSubmit={mockOnSubmit} />);

            const select = screen.getByLabelText('Select Option');
            expect(select.tagName).toBe('SELECT');
            expect(screen.getByText('Option 1')).toBeInTheDocument();
            expect(screen.getByText('Option 2')).toBeInTheDocument();
        });

        it('renders multiselect checkboxes correctly', () => {
            render(<DynamicForm schema={fieldTypesSchema} onSubmit={mockOnSubmit} />);

            expect(screen.getByText('Tag 1')).toBeInTheDocument();
            expect(screen.getByText('Tag 2')).toBeInTheDocument();

            const checkboxes = screen.getAllByRole('checkbox');
            expect(checkboxes).toHaveLength(3); // 2 multiselect + 1 boolean checkbox
        });

        it('renders checkbox correctly', () => {
            render(<DynamicForm schema={fieldTypesSchema} onSubmit={mockOnSubmit} />);

            const checkbox = screen.getByLabelText('Checkbox');
            expect(checkbox).toHaveAttribute('type', 'checkbox');
        });

        it('renders file input correctly', () => {
            render(<DynamicForm schema={fieldTypesSchema} onSubmit={mockOnSubmit} />);

            const fileInput = screen.getByLabelText('File Upload');
            expect(fileInput).toHaveAttribute('type', 'file');
        });
    });

    describe('Form Submission', () => {
        const submissionSchema: JsonFormSchema = {
            title: 'Submission Test',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                    label: 'Name',
                    required: true,
                },
                {
                    name: 'email',
                    type: 'email',
                    label: 'Email',
                    required: true,
                },
            ],
        };

        it('submits form with valid data', async () => {
            const userEventInstance = userEvent.setup();
            render(<DynamicForm schema={submissionSchema} onSubmit={mockOnSubmit} />);

            const nameInput = screen.getByLabelText('Name *');
            const emailInput = screen.getByLabelText('Email *');
            const submitButton = screen.getByText('Submit');

            await userEventInstance.type(nameInput, 'John Doe');
            await userEventInstance.type(emailInput, 'john@example.com');
            await userEventInstance.click(submitButton);

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith({
                    name: 'John Doe',
                    email: 'john@example.com',
                });
            });
        });

        it('resets form after successful submission', async () => {
            const userEventInstance = userEvent.setup();
            render(<DynamicForm schema={submissionSchema} onSubmit={mockOnSubmit} />);

            const nameInput = screen.getByLabelText('Name *');
            const emailInput = screen.getByLabelText('Email *');
            const submitButton = screen.getByText('Submit');

            await userEventInstance.type(nameInput, 'John Doe');
            await userEventInstance.type(emailInput, 'john@example.com');
            await userEventInstance.click(submitButton);

            await waitFor(() => {
                expect(nameInput).toHaveValue('');
                expect(emailInput).toHaveValue('');
            });
        });

        it('handles loading state', async () => {
            render(<DynamicForm schema={submissionSchema} onSubmit={mockOnSubmit} loading={true} />);

            const submitButton = screen.getByText('Submitting...');
            expect(submitButton).toBeDisabled();
        });
    });

    describe('Default Values', () => {
        const defaultValuesSchema: JsonFormSchema = {
            title: 'Default Values Test',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                    label: 'Name',
                    defaultValue: 'John Doe',
                },
                {
                    name: 'newsletter',
                    type: 'boolean',
                    label: 'Newsletter',
                    defaultValue: true,
                },
            ],
        };

        it('applies default values', () => {
            render(<DynamicForm schema={defaultValuesSchema} onSubmit={mockOnSubmit} />);

            const nameInput = screen.getByLabelText('Name');
            const newsletterCheckbox = screen.getByLabelText('Newsletter');

            expect(nameInput).toHaveValue('John Doe');
            expect(newsletterCheckbox).toBeChecked();
        });

        it('overrides default values with prop defaultValues', () => {
            render(
                <DynamicForm
                    schema={defaultValuesSchema}
                    onSubmit={mockOnSubmit}
                    defaultValues={{ name: 'Jane Doe' }}
                />
            );

            const nameInput = screen.getByLabelText('Name');
            expect(nameInput).toHaveValue('Jane Doe');
        });
    });

    describe('Reset Functionality', () => {
        const resetSchema: JsonFormSchema = {
            title: 'Reset Test',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                    label: 'Name',
                    defaultValue: 'Default Name',
                },
            ],
        };

        it('resets form to default values', async () => {
            const userEventInstance = userEvent.setup();
            render(<DynamicForm schema={resetSchema} onSubmit={mockOnSubmit} />);

            const nameInput = screen.getByLabelText('Name');
            const resetButton = screen.getByText('Reset');

            await userEventInstance.clear(nameInput);
            await userEventInstance.type(nameInput, 'New Name');
            expect(nameInput).toHaveValue('New Name');

            await userEventInstance.click(resetButton);
            expect(nameInput).toHaveValue('Default Name');
        });
    });
}); 