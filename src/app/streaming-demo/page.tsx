import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Clock,
    Users,
    TrendingUp,
    Activity,
    Database,
    Globe,
    Loader2
} from 'lucide-react';

// Simulated slow loading component
async function SlowComponent({ delay = 2000, title, description }: {
    delay?: number;
    title: string;
    description: string;
}) {
    await new Promise(resolve => setTimeout(resolve, delay));

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant="default" className="bg-green-500">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Response Time</span>
                        <span className="text-sm font-medium">{(delay / 1000).toFixed(1)}s</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Loading skeleton component
function LoadingSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// User stats component with streaming
async function UserStats() {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    User Statistics
                </CardTitle>
                <CardDescription>Real-time user activity data</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">1,234</div>
                        <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">89%</div>
                        <div className="text-sm text-muted-foreground">Engagement Rate</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Analytics component with streaming
async function AnalyticsData() {
    await new Promise(resolve => setTimeout(resolve, 3000));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Analytics Dashboard
                </CardTitle>
                <CardDescription>Performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Page Views</span>
                        <span className="font-semibold">45,678</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Bounce Rate</span>
                        <span className="font-semibold text-red-500">23%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Conversion Rate</span>
                        <span className="font-semibold text-green-500">4.2%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Database status component
async function DatabaseStatus() {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-orange-500" />
                    Database Status
                </CardTitle>
                <CardDescription>System health and performance</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Connection Pool</span>
                        <Badge variant="secondary">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Query Performance</span>
                        <span className="text-sm font-medium">12ms avg</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Storage Usage</span>
                        <span className="text-sm font-medium">67%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Network status component
async function NetworkStatus() {
    await new Promise(resolve => setTimeout(resolve, 2500));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Network Status
                </CardTitle>
                <CardDescription>Global connectivity and latency</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Global Latency</span>
                        <span className="text-sm font-medium">45ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Uptime</span>
                        <Badge variant="default" className="bg-green-500">99.9%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">CDN Status</span>
                        <Badge variant="secondary">Optimal</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function StreamingDemoPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Next.js Streaming Demo</h1>
                <p className="text-muted-foreground">
                    This page demonstrates Next.js streaming features with progressive loading states.
                    Each component loads independently, providing a better user experience.
                </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Components will load progressively with different delays</span>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Fast loading component */}
                <Suspense fallback={<LoadingSkeleton />}>
                    <SlowComponent
                        delay={500}
                        title="Fast Component"
                        description="This component loads quickly (0.5s delay)"
                    />
                </Suspense>

                {/* Medium loading component */}
                <Suspense fallback={<LoadingSkeleton />}>
                    <SlowComponent
                        delay={2000}
                        title="Medium Component"
                        description="This component takes a bit longer (2s delay)"
                    />
                </Suspense>

                {/* Slow loading component */}
                <Suspense fallback={<LoadingSkeleton />}>
                    <SlowComponent
                        delay={4000}
                        title="Slow Component"
                        description="This component takes the longest (4s delay)"
                    />
                </Suspense>

                {/* User Stats */}
                <Suspense fallback={<LoadingSkeleton />}>
                    <UserStats />
                </Suspense>

                {/* Analytics */}
                <Suspense fallback={<LoadingSkeleton />}>
                    <AnalyticsData />
                </Suspense>

                {/* Database Status */}
                <Suspense fallback={<LoadingSkeleton />}>
                    <DatabaseStatus />
                </Suspense>

                {/* Network Status */}
                <Suspense fallback={<LoadingSkeleton />}>
                    <NetworkStatus />
                </Suspense>
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Streaming Benefits</CardTitle>
                    <CardDescription>
                        Understanding how streaming improves user experience
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold">Progressive Loading</h4>
                            <p className="text-sm text-muted-foreground">
                                Components load independently, showing content as soon as it's ready.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold">Better UX</h4>
                            <p className="text-sm text-muted-foreground">
                                Users see immediate feedback and can interact with loaded parts.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold">Reduced Perceived Load Time</h4>
                            <p className="text-sm text-muted-foreground">
                                The page appears faster even when some components are still loading.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold">Graceful Degradation</h4>
                            <p className="text-sm text-muted-foreground">
                                Loading states provide clear feedback about what's happening.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 