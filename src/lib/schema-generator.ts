import { z } from 'zod';

// Types for JSON schema definition
export interface JsonFieldDefinition {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'textarea' | 'select' | 'multiselect' | 'date' | 'datetime' | 'file';
    label?: string;
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    options?: Array<{ value: string; label: string }>;
    defaultValue?: any;
    validation?: {
        message?: string;
        custom?: string; // Custom validation rule
    };
}

export interface JsonFormSchema {
    title?: string;
    description?: string;
    fields: JsonFieldDefinition[];
}

// Convert JSON field definition to Zod schema
export function jsonFieldToZod(field: JsonFieldDefinition): z.ZodTypeAny {
    let schema: z.ZodTypeAny;

    // Base schema based on type
    switch (field.type) {
        case 'string':
        case 'email':
        case 'url':
        case 'textarea':
            schema = z.string();
            break;
        case 'number':
            schema = z.number();
            break;
        case 'boolean':
            schema = z.boolean();
            break;
        case 'date':
        case 'datetime':
            schema = z.string(); // We'll handle date validation separately
            break;
        case 'file':
            schema = z.any(); // File handling is complex, using any for now
            break;
        case 'select':
        case 'multiselect':
            if (field.options) {
                const optionValues = field.options.map(opt => opt.value);
                schema = field.type === 'multiselect'
                    ? z.array(z.enum(optionValues as [string, ...string[]]))
                    : z.enum(optionValues as [string, ...string[]]);
            } else {
                schema = z.string();
            }
            break;
        default:
            schema = z.string();
    }

    // Apply validations
    if (field.required !== false) { // Default to required unless explicitly false
        // Only apply min validation to types that support it
        if (field.type === 'string' || field.type === 'email' || field.type === 'url' || field.type === 'textarea') {
            schema = (schema as z.ZodString).min(1, { message: field.validation?.message || `${field.label || field.name} is required` });
        } else if (field.type === 'number') {
            schema = (schema as z.ZodNumber).min(1, { message: field.validation?.message || `${field.label || field.name} is required` });
        } else if (field.type === 'multiselect') {
            schema = (schema as z.ZodArray<any>).min(1, { message: field.validation?.message || `${field.label || field.name} is required` });
        }
        // For other types (boolean, select, file, etc.), we'll handle required validation differently
        else if (field.type === 'boolean' || field.type === 'select' || field.type === 'file') {
            schema = schema.refine((val) => {
                if (field.type === 'boolean') {
                    return val !== undefined && val !== null;
                } else if (field.type === 'select') {
                    return val !== undefined && val !== null && val !== '';
                } else if (field.type === 'file') {
                    return val !== undefined && val !== null;
                }
                return true;
            }, {
                message: field.validation?.message || `${field.label || field.name} is required`
            });
        }
    }

    if (field.minLength) {
        // Only apply minLength to string types
        if (field.type === 'string' || field.type === 'email' || field.type === 'url' || field.type === 'textarea') {
            schema = (schema as z.ZodString).min(field.minLength, {
                message: field.validation?.message || `${field.label || field.name} must be at least ${field.minLength} characters`
            });
        }
    }

    if (field.maxLength) {
        // Only apply maxLength to string types
        if (field.type === 'string' || field.type === 'email' || field.type === 'url' || field.type === 'textarea') {
            schema = (schema as z.ZodString).max(field.maxLength, {
                message: field.validation?.message || `${field.label || field.name} must be less than ${field.maxLength} characters`
            });
        }
    }

    if (field.min !== undefined && field.type === 'number') {
        schema = (schema as z.ZodNumber).min(field.min, {
            message: field.validation?.message || `${field.label || field.name} must be at least ${field.min}`
        });
    }

    if (field.max !== undefined && field.type === 'number') {
        schema = (schema as z.ZodNumber).max(field.max, {
            message: field.validation?.message || `${field.label || field.name} must be less than ${field.max}`
        });
    }

    if (field.pattern) {
        // Only apply pattern validation to string types
        if (field.type === 'string' || field.type === 'email' || field.type === 'url' || field.type === 'textarea') {
            schema = (schema as z.ZodString).regex(new RegExp(field.pattern), {
                message: field.validation?.message || `${field.label || field.name} format is invalid`
            });
        }
    }

    // Type-specific validations
    if (field.type === 'email') {
        schema = (schema as z.ZodString).email({
            message: field.validation?.message || 'Please enter a valid email address'
        });
    }

    if (field.type === 'url') {
        schema = (schema as z.ZodString).url({
            message: field.validation?.message || 'Please enter a valid URL'
        });
    }

    if (field.type === 'date' || field.type === 'datetime') {
        schema = (schema as z.ZodString).refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, {
            message: field.validation?.message || `Please enter a valid ${field.type}`
        });
    }

    // Make optional if not required
    if (field.required === false) {
        schema = schema.optional();
    }

    return schema;
}

// Convert JSON form schema to Zod schema
export function jsonSchemaToZod(jsonSchema: JsonFormSchema): z.ZodObject<any> {
    const schemaObject: Record<string, z.ZodTypeAny> = {};

    jsonSchema.fields.forEach(field => {
        schemaObject[field.name] = jsonFieldToZod(field);
    });

    return z.object(schemaObject);
}

// Generate form field configuration
export function generateFieldConfig(field: JsonFieldDefinition) {
    const config = {
        name: field.name,
        label: field.label || field.name,
        placeholder: field.placeholder || `Enter ${field.label || field.name}`,
        type: getInputType(field.type),
        required: field.required !== false,
        min: field.min,
        max: field.max,
        minLength: field.minLength,
        maxLength: field.maxLength,
        pattern: field.pattern,
        options: field.options,
        defaultValue: field.defaultValue,
        validation: field.validation,
    };

    return config;
}

// Get appropriate input type for HTML input
function getInputType(fieldType: string): string {
    switch (fieldType) {
        case 'email':
            return 'email';
        case 'url':
            return 'url';
        case 'number':
            return 'number';
        case 'date':
            return 'date';
        case 'datetime':
            return 'datetime-local';
        case 'textarea':
            return 'textarea';
        case 'select':
        case 'multiselect':
            return 'select';
        case 'file':
            return 'file';
        default:
            return 'text';
    }
}

// Example JSON schemas for demonstration
export const exampleSchemas = {
    userRegistration: {
        title: 'User Registration',
        description: 'Create a new user account',
        fields: [
            {
                name: 'firstName',
                type: 'string',
                label: 'First Name',
                placeholder: 'Enter your first name',
                required: true,
                minLength: 2,
                maxLength: 50,
            },
            {
                name: 'lastName',
                type: 'string',
                label: 'Last Name',
                placeholder: 'Enter your last name',
                required: true,
                minLength: 2,
                maxLength: 50,
            },
            {
                name: 'email',
                type: 'email',
                label: 'Email Address',
                placeholder: 'Enter your email address',
                required: true,
            },
            {
                name: 'password',
                type: 'string',
                label: 'Password',
                placeholder: 'Enter your password',
                required: true,
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
                validation: {
                    message: 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number'
                }
            },
            {
                name: 'age',
                type: 'number',
                label: 'Age',
                placeholder: 'Enter your age',
                required: true,
                min: 13,
                max: 120,
            },
            {
                name: 'website',
                type: 'url',
                label: 'Website (Optional)',
                placeholder: 'https://example.com',
                required: false,
            },
            {
                name: 'bio',
                type: 'textarea',
                label: 'Bio',
                placeholder: 'Tell us about yourself',
                required: false,
                maxLength: 500,
            },
            {
                name: 'role',
                type: 'select',
                label: 'Role',
                required: true,
                options: [
                    { value: 'user', label: 'User' },
                    { value: 'admin', label: 'Administrator' },
                    { value: 'moderator', label: 'Moderator' },
                ],
            },
            {
                name: 'interests',
                type: 'multiselect',
                label: 'Interests',
                required: false,
                options: [
                    { value: 'technology', label: 'Technology' },
                    { value: 'sports', label: 'Sports' },
                    { value: 'music', label: 'Music' },
                    { value: 'travel', label: 'Travel' },
                    { value: 'cooking', label: 'Cooking' },
                ],
            },
            {
                name: 'birthDate',
                type: 'date',
                label: 'Birth Date',
                required: true,
            },
            {
                name: 'newsletter',
                type: 'boolean',
                label: 'Subscribe to newsletter',
                required: false,
                defaultValue: false,
            },
        ],
    },
    productForm: {
        title: 'Product Information',
        description: 'Add or edit product details',
        fields: [
            {
                name: 'name',
                type: 'string',
                label: 'Product Name',
                placeholder: 'Enter product name',
                required: true,
                minLength: 3,
                maxLength: 100,
            },
            {
                name: 'description',
                type: 'textarea',
                label: 'Description',
                placeholder: 'Enter product description',
                required: true,
                minLength: 10,
                maxLength: 1000,
            },
            {
                name: 'price',
                type: 'number',
                label: 'Price',
                placeholder: '0.00',
                required: true,
                min: 0,
                max: 999999,
            },
            {
                name: 'category',
                type: 'select',
                label: 'Category',
                required: true,
                options: [
                    { value: 'electronics', label: 'Electronics' },
                    { value: 'clothing', label: 'Clothing' },
                    { value: 'books', label: 'Books' },
                    { value: 'home', label: 'Home & Garden' },
                ],
            },
            {
                name: 'tags',
                type: 'multiselect',
                label: 'Tags',
                required: false,
                options: [
                    { value: 'new', label: 'New' },
                    { value: 'sale', label: 'On Sale' },
                    { value: 'featured', label: 'Featured' },
                    { value: 'trending', label: 'Trending' },
                ],
            },
            {
                name: 'image',
                type: 'file',
                label: 'Product Image',
                required: false,
            },
        ],
    },
}; 