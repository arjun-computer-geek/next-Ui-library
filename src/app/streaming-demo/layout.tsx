import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Info, Zap, Clock, CheckCircle } from 'lucide-react';

// Async component that loads with a delay
async function StreamingInfo() {
    // Simulate a delay to show streaming in action
    await new Promise(resolve => setTimeout(resolve, 1000));

    return (
        <Card className="mb-6 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Zap className="h-5 w-5" />
                    Streaming Layout Active
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                    This layout demonstrates how Next.js streaming works with layouts
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Layout loaded</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Page streaming</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">React 18+</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Loading skeleton for the streaming info
function StreamingInfoSkeleton() {
    return (
        <Card className="mb-6 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function StreamingDemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-6">
            {/* Streaming info component with Suspense */}
            <Suspense fallback={<StreamingInfoSkeleton />}>
                <StreamingInfo />
            </Suspense>

            <Separator />

            {/* Main content */}
            {children}

            {/* Footer info */}
            <Separator />

            <Card className="mt-6 border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Info className="h-5 w-5" />
                        How Streaming Works
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold">Layout Streaming</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Layout loads immediately</li>
                                <li>• Page content streams in</li>
                                <li>• Components load progressively</li>
                                <li>• Better perceived performance</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold">Benefits</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Faster initial page load</li>
                                <li>• Progressive content display</li>
                                <li>• Better user experience</li>
                                <li>• Reduced time to interactive</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 