'use client';

import { PostsCrud } from '@/components/posts-crud';

export default function DemoPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Posts CRUD Demo</h1>
                <p className="text-gray-600">
                    A comprehensive posts management system with Zod validation, API integration, and state management.
                </p>
            </div>

            <PostsCrud />
        </div>
    );
} 