# Dynamic Form Generator with Zod Validation

A powerful feature that allows you to generate form fields with Zod validation from JSON schema definitions. This eliminates the need to write repetitive form code and ensures type safety throughout your application.

## 🚀 Features

- **JSON Schema to Zod Conversion**: Automatically convert JSON schema definitions to Zod validation schemas
- **Dynamic Field Generation**: Generate form fields dynamically based on schema definitions
- **Type Safety**: Full TypeScript support with automatic type inference
- **Multiple Field Types**: Support for text, email, number, textarea, select, multiselect, boolean, date, file, and more
- **Real-time Validation**: Instant validation feedback with custom error messages
- **Customizable**: Easy to extend with custom field types and validation rules

## 📋 Supported Field Types

| Type | Description | HTML Input |
|------|-------------|------------|
| `string` | Text input | `<input type="text">` |
| `email` | Email input with validation | `<input type="email">` |
| `url` | URL input with validation | `<input type="url">` |
| `number` | Number input | `<input type="number">` |
| `textarea` | Multi-line text input | `<textarea>` |
| `select` | Dropdown selection | `<select>` |
| `multiselect` | Multiple checkbox selection | `<input type="checkbox">` |
| `boolean` | Checkbox | `<input type="checkbox">` |
| `date` | Date picker | `<input type="date">` |
| `datetime` | Date and time picker | `<input type="datetime-local">` |
| `file` | File upload | `<input type="file">` |

## 🛠️ Installation

The feature is already integrated into the project. No additional installation required.

## 📖 Usage

### Basic Example

```tsx
import { DynamicForm } from '@/components/dynamic-form';

const schema = {
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
  ],
};

function MyComponent() {
  const handleSubmit = async (data) => {
    console.log('Form data:', data);
    // Handle form submission
  };

  return (
    <DynamicForm
      schema={schema}
      onSubmit={handleSubmit}
      submitText="Create Account"
    />
  );
}
```

### Advanced Example with All Field Types

```tsx
const advancedSchema = {
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
    {
      name: 'publishDate',
      type: 'date',
      label: 'Publish Date',
      required: true,
    },
    {
      name: 'isActive',
      type: 'boolean',
      label: 'Active Product',
      required: false,
      defaultValue: true,
    },
  ],
};
```

## 🔧 Schema Definition

### Field Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Unique field identifier |
| `type` | `FieldType` | Field type (see supported types above) |
| `label` | `string` | Display label for the field |
| `placeholder` | `string` | Placeholder text |
| `required` | `boolean` | Whether the field is required (default: true) |
| `min` | `number` | Minimum value (for numbers) |
| `max` | `number` | Maximum value (for numbers) |
| `minLength` | `number` | Minimum length (for strings) |
| `maxLength` | `number` | Maximum length (for strings) |
| `pattern` | `string` | Regex pattern for validation |
| `options` | `Array<{value: string, label: string}>` | Options for select/multiselect |
| `defaultValue` | `any` | Default value for the field |
| `validation` | `{message?: string, custom?: string}` | Custom validation configuration |

### Schema Properties

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Form title |
| `description` | `string` | Form description |
| `fields` | `JsonFieldDefinition[]` | Array of field definitions |

## 🎯 Component Props

```tsx
interface DynamicFormProps {
  schema: JsonFormSchema;                    // JSON schema definition
  onSubmit: (data: any) => void | Promise<void>; // Form submission handler
  defaultValues?: Record<string, any>;       // Default form values
  submitText?: string;                       // Submit button text
  loading?: boolean;                         // Loading state
  className?: string;                        // Additional CSS classes
}
```

## 🔍 Validation Features

### Built-in Validations

- **Required fields**: Automatically validates required fields
- **String length**: `minLength` and `maxLength` for text fields
- **Number range**: `min` and `max` for number fields
- **Email format**: Automatic email validation
- **URL format**: Automatic URL validation
- **Date format**: Date validation for date/datetime fields
- **Regex patterns**: Custom pattern validation

### Custom Validation Messages

```tsx
{
  name: 'password',
  type: 'string',
  label: 'Password',
  required: true,
  minLength: 8,
  validation: {
    message: 'Password must be at least 8 characters long and contain uppercase, lowercase, and number'
  }
}
```

## 🧪 Testing

The component includes comprehensive tests covering:

- Form rendering with different field types
- Validation behavior
- Form submission
- Default values
- Reset functionality
- Loading states

Run tests with:

```bash
npm test -- dynamic-form.test.tsx
```

## 🎨 Styling

The component uses the existing UI components and follows the design system:

- Uses `@/components/ui/button` for buttons
- Uses `@/components/ui/input` for inputs
- Uses `@/components/ui/card` for layout
- Follows Tailwind CSS classes for styling
- Supports dark mode automatically

## 🚀 Demo

Visit `/dynamic-form-demo` to see the feature in action with:

- Pre-built example schemas
- Custom JSON schema input
- Real-time form generation
- Live validation feedback
- Form data display

## 🔧 Customization

### Adding New Field Types

To add a new field type:

1. Update the `JsonFieldDefinition` type in `src/lib/schema-generator.ts`
2. Add the type to the `jsonFieldToZod` function
3. Add the rendering logic in `src/components/dynamic-form.tsx`
4. Update the `getInputType` function

### Custom Validation Rules

```tsx
// In jsonFieldToZod function
if (field.validation?.custom) {
  schema = schema.refine((val) => {
    // Custom validation logic
    return customValidationFunction(val);
  }, {
    message: field.validation.message || 'Custom validation failed'
  });
}
```

## 📚 API Reference

### Functions

#### `jsonFieldToZod(field: JsonFieldDefinition): z.ZodTypeAny`
Converts a JSON field definition to a Zod schema.

#### `jsonSchemaToZod(jsonSchema: JsonFormSchema): z.ZodObject<any>`
Converts a complete JSON schema to a Zod object schema.

#### `generateFieldConfig(field: JsonFieldDefinition)`
Generates form field configuration from a field definition.

### Types

#### `JsonFieldDefinition`
```tsx
interface JsonFieldDefinition {
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
    custom?: string;
  };
}
```

#### `JsonFormSchema`
```tsx
interface JsonFormSchema {
  title?: string;
  description?: string;
  fields: JsonFieldDefinition[];
}
```

## 🤝 Contributing

To contribute to this feature:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This feature is part of the main project and follows the same license terms. 