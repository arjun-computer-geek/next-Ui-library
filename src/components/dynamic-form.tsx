'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    JsonFormSchema,
    JsonFieldDefinition,
    jsonSchemaToZod,
    generateFieldConfig
} from '@/lib/schema-generator';

export interface DynamicFormProps {
    schema: JsonFormSchema;
    onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
    defaultValues?: Record<string, unknown>;
    submitText?: string;
    loading?: boolean;
    className?: string;
}

export interface DynamicFormRef {
    trigger: () => Promise<boolean>;
}

export const DynamicForm = forwardRef<DynamicFormRef, DynamicFormProps>(({
    schema,
    onSubmit,
    defaultValues = {},
    submitText = 'Submit',
    loading = false,
    className = '',
}, ref) => {
    // Generate Zod schema from JSON schema
    const zodSchema = jsonSchemaToZod(schema);
    type FormData = z.infer<typeof zodSchema>;

    // Create default values object
    const createDefaultValues = () => {
        const defaults: Record<string, unknown> = {};

        schema.fields.forEach(field => {
            const fieldName = field.name as string;
            if (defaultValues[fieldName] !== undefined) {
                defaults[fieldName] = defaultValues[fieldName];
            } else if (field.defaultValue !== undefined) {
                defaults[fieldName] = field.defaultValue;
            } else {
                // Provide appropriate default based on field type
                switch (field.type) {
                    case 'string':
                    case 'email':
                    case 'url':
                    case 'textarea':
                    case 'date':
                    case 'datetime':
                        defaults[fieldName] = '';
                        break;
                    case 'number':
                        defaults[fieldName] = '';
                        break;
                    case 'boolean':
                        defaults[fieldName] = false;
                        break;
                    case 'select':
                        defaults[fieldName] = '';
                        break;
                    case 'multiselect':
                        defaults[fieldName] = [];
                        break;
                    case 'file':
                        defaults[fieldName] = null;
                        break;
                    default:
                        defaults[fieldName] = '';
                }
            }
        });

        return defaults;
    };

    // Set up form with React Hook Form and Zod validation
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        trigger,
    } = useForm<FormData>({
        resolver: zodResolver(zodSchema),
        defaultValues: createDefaultValues(),
        mode: 'onChange',
    });

    // Expose trigger method via ref
    useImperativeHandle(ref, () => ({
        trigger,
    }));

    const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
        try {
            await onSubmit(data);
            reset();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    // Render individual form field
    const renderField = (field: JsonFieldDefinition) => {
        const config = generateFieldConfig(field);
        const fieldName = field.name as string;
        const error = errors[fieldName as keyof FormData];

        return (
            <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                    {config.label}
                    {config.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                <Controller
                    name={fieldName as keyof FormData}
                    control={control}
                    render={({ field: controllerField }) => {
                        switch (field.type) {
                            case 'textarea':
                                return (
                                    <textarea
                                        {...controllerField}
                                        id={field.name}
                                        placeholder={config.placeholder}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                        minLength={config.minLength}
                                        maxLength={config.maxLength}
                                        required={config.required}
                                    />
                                );

                            case 'select':
                                return (
                                    <select
                                        {...controllerField}
                                        id={field.name}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        required={config.required}
                                    >
                                        <option value="">{config.placeholder}</option>
                                        {config.options?.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                );

                            case 'multiselect':
                                return (
                                    <div className="space-y-2">
                                        {config.options?.map((option) => (
                                            <label key={option.value} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    value={option.value}
                                                    checked={Array.isArray(controllerField.value) ? controllerField.value.includes(option.value) : false}
                                                    onChange={(e) => {
                                                        const currentValue = Array.isArray(controllerField.value) ? controllerField.value : [];
                                                        if (e.target.checked) {
                                                            controllerField.onChange([...currentValue, option.value]);
                                                        } else {
                                                            controllerField.onChange(
                                                                currentValue.filter((val: string) => val !== option.value)
                                                            );
                                                        }
                                                    }}
                                                    className="rounded border-gray-300"
                                                />
                                                <span className="text-sm">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                );

                            case 'boolean':
                                return (
                                    <label className="flex items-center space-x-2">
                                        <input
                                            {...controllerField}
                                            type="checkbox"
                                            id={field.name}
                                            className="rounded border-gray-300"
                                            checked={controllerField.value || false}
                                        />
                                        <span className="text-sm">{config.label}</span>
                                    </label>
                                );

                            case 'file':
                                return (
                                    <input
                                        {...controllerField}
                                        type="file"
                                        id={field.name}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        required={config.required}
                                    />
                                );

                            default:
                                return (
                                    <Input
                                        {...controllerField}
                                        id={field.name}
                                        type={config.type}
                                        placeholder={config.placeholder}
                                        min={config.min}
                                        max={config.max}
                                        minLength={config.minLength}
                                        maxLength={config.maxLength}
                                        pattern={config.pattern}
                                        required={config.required}
                                        className="w-full"
                                    />
                                );
                        }
                    }}
                />

                {error && (
                    <p className="text-red-500 text-sm">{error.message?.toString()}</p>
                )}
            </div>
        );
    };

    return (
        <Card className={className}>
            <CardHeader>
                {schema.title && (
                    <CardTitle className="text-xl">{schema.title}</CardTitle>
                )}
                {schema.description && (
                    <p className="text-muted-foreground">{schema.description}</p>
                )}
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {schema.fields.map(renderField)}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => reset()}
                            disabled={loading}
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : submitText}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
});

DynamicForm.displayName = 'DynamicForm';