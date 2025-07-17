'use client';

import React, { useState } from 'react';
import { DynamicForm } from '@/components/dynamic-form';
import { exampleSchemas, JsonFormSchema } from '@/lib/schema-generator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Code, Play, FileText, Users, Package } from 'lucide-react';

export default function DynamicFormDemoPage() {
    const [selectedSchema, setSelectedSchema] = useState<keyof typeof exampleSchemas>('userRegistration');
    const [customSchema, setCustomSchema] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<any>(null);

    const handleFormSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFormData(data);
            toast.success('Form submitted successfully!');
            console.log('Form data:', data);
        } catch (error) {
            toast.error('Failed to submit form');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCustomSchemaSubmit = () => {
        try {
            const parsedSchema: JsonFormSchema = JSON.parse(customSchema);
            setSelectedSchema('custom' as any);
            toast.success('Custom schema loaded successfully!');
        } catch (error) {
            toast.error('Invalid JSON schema');
        }
    };

    const schemaOptions = [
        { key: 'userRegistration', label: 'User Registration', icon: Users },
        { key: 'productForm', label: 'Product Form', icon: Package },
    ];

    const currentSchema = selectedSchema === 'userRegistration' || selectedSchema === 'productForm'
        ? exampleSchemas[selectedSchema]
        : (() => {
            try {
                return JSON.parse(customSchema);
            } catch {
                return exampleSchemas.userRegistration;
            }
        })();

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Dynamic Form Generator</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Generate form fields with Zod validation from JSON schema definitions.
                    This feature allows you to create dynamic, type-safe forms without writing repetitive code.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Schema Selection */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Schema Selection
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-2">
                                {schemaOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <Button
                                            key={option.key}
                                            variant={selectedSchema === option.key ? 'default' : 'outline'}
                                            onClick={() => setSelectedSchema(option.key as keyof typeof exampleSchemas)}
                                            className="justify-start"
                                        >
                                            <Icon className="w-4 h-4 mr-2" />
                                            {option.label}
                                        </Button>
                                    );
                                })}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Custom JSON Schema</label>
                                <textarea
                                    value={customSchema}
                                    onChange={(e) => setCustomSchema(e.target.value)}
                                    placeholder="Paste your JSON schema here..."
                                    className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                                />
                                <Button
                                    onClick={handleCustomSchemaSubmit}
                                    size="sm"
                                    className="w-full"
                                >
                                    <Code className="w-4 h-4 mr-2" />
                                    Load Custom Schema
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Schema Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="w-5 h-5" />
                                Schema Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-64">
                                {JSON.stringify(currentSchema, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                </div>

                {/* Dynamic Form */}
                <div className="space-y-6">
                    <DynamicForm
                        schema={currentSchema}
                        onSubmit={handleFormSubmit}
                        submitText="Submit Form"
                        loading={isLoading}
                    />

                    {/* Form Data Display */}
                    {formData && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Play className="w-5 h-5" />
                                    Submitted Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-64">
                                    {JSON.stringify(formData, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                                    <Code className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">JSON Schema to Zod</h3>
                                <p className="text-sm text-muted-foreground">
                                    Automatically convert JSON schema definitions to Zod validation schemas
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Dynamic Field Generation</h3>
                                <p className="text-sm text-muted-foreground">
                                    Generate form fields dynamically based on schema definitions
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold">Type Safety</h3>
                                <p className="text-sm text-muted-foreground">
                                    Full TypeScript support with automatic type inference
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Usage Examples */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-center mb-8">Usage Examples</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Usage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                                {`import { DynamicForm } from '@/components/dynamic-form';

const schema = {
  title: 'User Registration',
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true
    },
    {
      name: 'password',
      type: 'string',
      label: 'Password',
      required: true,
      minLength: 8
    }
  ]
};

<DynamicForm
  schema={schema}
  onSubmit={(data) => console.log(data)}
/>`}
                            </pre>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Advanced Schema</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                                {`const advancedSchema = {
  title: 'Product Form',
  fields: [
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' }
      ]
    },
    {
      name: 'tags',
      type: 'multiselect',
      label: 'Tags',
      options: [
        { value: 'new', label: 'New' },
        { value: 'sale', label: 'On Sale' }
      ]
    }
  ]
};`}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}