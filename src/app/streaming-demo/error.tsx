'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Streaming demo error:', error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-xl">Something went wrong!</CardTitle>
                    <CardDescription>
                        An error occurred while loading the streaming demo components.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-md bg-red-50 dark:bg-red-950/20 p-3">
                        <p className="text-sm text-red-700 dark:text-red-300">
                            {error.message || 'An unexpected error occurred'}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={reset}
                            className="w-full"
                            variant="default"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try again
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full"
                        >
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Go back home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 