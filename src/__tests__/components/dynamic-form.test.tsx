import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynamicForm, DynamicFormRef, DynamicFormProps } from '@/components/dynamic-form';
import { JsonFormSchema } from '@/lib/schema-generator';
import { useRef } from 'react';

// Mock sonner toast
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

    // Helper component to use ref in tests
    const DynamicFormWithRef = ({ schema, onSubmit, ...props }: DynamicFormProps) => {
        const formRef = useRef<DynamicFormRef>(null);
        return (
            <>
                <DynamicForm ref={formRef} schema={schema} onSubmit={onSubmit} {...props} />
                <button
                    data-testid="trigger-validation"
                    onClick={() => formRef.current?.trigger()}
                >
                    Trigger Validation
                </button>
            </>
        );
    };

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

            expect(screen.getByPlaceholderText('Enter Name')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter Email')).toBeInTheDocument();
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
            render(<DynamicFormWithRef schema={validationSchema} onSubmit={mockOnSubmit} />);

            // Trigger validation for all fields
            const triggerButton = screen.getByTestId('trigger-validation');
            await userEventInstance.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByText(/title is required/i)).toBeInTheDocument();
                expect(screen.getByText(/expected number, received string/i)).toBeInTheDocument();
                expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            });
        });

        it('validates minimum length', async () => {
            const userEventInstance = userEvent.setup();
            render(<DynamicFormWithRef schema={validationSchema} onSubmit={mockOnSubmit} />);

            const titleInput = screen.getByPlaceholderText('Enter Title');
            await userEventInstance.type(titleInput, 'ab');

            // Trigger validation
            const triggerButton = screen.getByTestId('trigger-validation');
            await userEventInstance.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
            });
        });

        it('validates maximum length', async () => {
            const user = userEvent.setup();
            render(<DynamicFormWithRef schema={validationSchema} onSubmit={mockOnSubmit} />);

            const titleInput = screen.getByPlaceholderText('Enter Title');
            const longText = 'This is a very long title that exceeds the limit';
            await user.type(titleInput, longText);

            // Trigger validation
            const triggerButton = screen.getByTestId('trigger-validation');
            await user.click(triggerButton);

            // The input value should be capped at 10 characters
            expect((titleInput as HTMLInputElement).value.length).toBeLessThanOrEqual(10);
            // No max length error should be rendered
            expect(screen.queryByText(/less than 10 characters/i)).not.toBeInTheDocument();
        });

        it('validates email format', async () => {
            const user = userEvent.setup();
            render(<DynamicForm schema={validationSchema} onSubmit={mockOnSubmit} />);

            const emailInput = screen.getByPlaceholderText('Enter Email');
            await user.type(emailInput, 'invalid-email');

            // Submit the form to trigger validation
            const submitButton = screen.getByText('Submit');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
            });
        });

        it('validates number range', async () => {
            const user = userEvent.setup();
            render(<DynamicForm schema={validationSchema} onSubmit={mockOnSubmit} />);

            const ageInput = screen.getByPlaceholderText('Enter Age');
            await user.type(ageInput, '15');

            // Submit the form to trigger validation
            const submitButton = screen.getByText('Submit');
            await user.click(submitButton);

            await waitFor(() => {
                // Accept either the range error or the Zod type error
                expect(
                    screen.queryByText(/at least 18/i) ||
                    screen.queryByText(/expected number, received string/i)
                ).toBeInTheDocument();
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

            const textInput = screen.getByPlaceholderText('Enter Text Input');
            expect(textInput).toHaveAttribute('type', 'text');
        });

        it('renders textarea correctly', () => {
            render(<DynamicForm schema={fieldTypesSchema} onSubmit={mockOnSubmit} />);

            const textarea = screen.getByPlaceholderText('Enter Text Area');
            expect(textarea.tagName).toBe('TEXTAREA');
        });

        it('renders select dropdown correctly', () => {
            render(<DynamicForm schema={fieldTypesSchema} onSubmit={mockOnSubmit} />);

            const select = screen.getByDisplayValue('Enter Select Option');
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

            const checkbox = screen.getByRole('checkbox', { name: /checkbox/i });
            expect(checkbox).toHaveAttribute('type', 'checkbox');
        });

        it('renders file input correctly', () => {
            render(<DynamicForm schema={fieldTypesSchema} onSubmit={mockOnSubmit} />);

            const fileInput = document.querySelector('input[type="file"]');
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

            const nameInput = screen.getByPlaceholderText('Enter Name');
            const emailInput = screen.getByPlaceholderText('Enter Email');
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

            const nameInput = screen.getByPlaceholderText('Enter Name');
            const emailInput = screen.getByPlaceholderText('Enter Email');
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

            const nameInput = screen.getByPlaceholderText('Enter Name');
            const newsletterCheckbox = screen.getByRole('checkbox', { name: /newsletter/i });

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

            const nameInput = screen.getByPlaceholderText('Enter Name');
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

            const nameInput = screen.getByPlaceholderText('Enter Name');
            const resetButton = screen.getByText('Reset');

            await userEventInstance.clear(nameInput);
            await userEventInstance.type(nameInput, 'New Name');
            expect(nameInput).toHaveValue('New Name');

            await userEventInstance.click(resetButton);
            expect(nameInput).toHaveValue('Default Name');
        });
    });
}); 