'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { postFormSchema, PostFormValues } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePosts } from '@/hooks/use-posts';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, Edit, PlusCircle, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Post Form Component
const PostForm = ({
    onSubmit,
    defaultValues,
    isLoading,
    mode,
}: {
    onSubmit: SubmitHandler<PostFormValues>;
    defaultValues: PostFormValues;
    isLoading: boolean;
    mode: 'create' | 'edit';
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<PostFormValues>({
        resolver: zodResolver(postFormSchema),
        defaultValues,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Post Title"
                            className="w-full"
                        />
                    )}
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
            </div>

            <div>
                <Controller
                    name="body"
                    control={control}
                    render={({ field }) => (
                        <textarea
                            {...field}
                            placeholder="Post Content"
                            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                />
                {errors.body && (
                    <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
                )}
            </div>

            <div>
                <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Tags (comma-separated)"
                            className="w-full"
                        />
                    )}
                />
                {errors.tags && (
                    <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
                )}
            </div>

            <div>
                <Controller
                    name="userId"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="number"
                            placeholder="User ID"
                            className="w-full"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />
                {errors.userId && (
                    <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>
                )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Update Post'}
            </Button>
        </form>
    );
};

// Post Item Component
const PostItem = ({
    post,
    onEdit,
    onDelete,
    isDeleting
}: {
    post: any;
    onEdit: (post: any) => void;
    onDelete: (id: number) => void;
    isDeleting: boolean;
}) => (
    <Card className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
        <div className="flex-1">
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.body}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>User ID: {post.userId}</span>
                {post.tags && post.tags.length > 0 && (
                    <span>Tags: {post.tags.join(', ')}</span>
                )}
                {post.reactions && (
                    <span>👍 {post.reactions.likes} 👎 {post.reactions.dislikes}</span>
                )}
                {post.views !== undefined && <span>👁️ {post.views}</span>}
            </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(post)}
                disabled={isDeleting}
            >
                <Edit className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(post.id)}
                disabled={isDeleting}
            >
                <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
        </div>
    </Card>
);

// Main Posts CRUD Component
export function PostsCrud() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const {
        posts,
        isLoading,
        isLoadingMore,
        isCreating,
        isUpdating,
        isDeleting,
        error,
        hasMore,
        createPost,
        updatePost,
        deletePost,
        searchPosts,
        loadMore,
        refresh,
        clearError,
    } = usePosts();

    // Handle form submission
    const handleFormSubmit: SubmitHandler<PostFormValues> = async (data) => {
        try {
            // Transform form data to match API expectations
            const transformedData = {
                title: data.title,
                body: data.body,
                tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
                userId: data.userId,
            };

            if (editingPost) {
                const result = await updatePost(editingPost.id, transformedData);
                if (result) {
                    toast.success('Post updated successfully!');
                    setIsFormOpen(false);
                    setEditingPost(null);
                }
            } else {
                const result = await createPost(transformedData);
                if (result) {
                    toast.success('Post created successfully!');
                    setIsFormOpen(false);
                }
            }
        } catch (error) {
            toast.error('Failed to save post');
        }
    };

    // Handle delete
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const success = await deletePost(id);
            if (success) {
                toast.success('Post deleted successfully!');
            }
        }
    };

    // Handle edit
    const handleEdit = (post: any) => {
        setEditingPost(post);
        setIsFormOpen(true);
    };

    // Handle create
    const handleCreate = () => {
        setEditingPost(null);
        setIsFormOpen(true);
    };

    // Handle search
    const handleSearch = () => {
        if (searchQuery.trim()) {
            searchPosts(searchQuery.trim());
        } else {
            refresh();
        }
    };

    // Clear error when component unmounts or error changes
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manage Posts</CardTitle>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-64"
                        />
                        <Button variant="outline" size="icon" onClick={handleSearch}>
                            <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={refresh}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>

                    <Dialog
                        open={isFormOpen}
                        onOpenChange={(isOpen) => {
                            setIsFormOpen(isOpen);
                            if (!isOpen) {
                                setEditingPost(null);
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button onClick={handleCreate}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Post
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingPost ? 'Edit Post' : 'Create a New Post'}
                                </DialogTitle>
                            </DialogHeader>
                            <PostForm
                                onSubmit={handleFormSubmit}
                                defaultValues={
                                    editingPost
                                        ? {
                                            title: editingPost.title,
                                            body: editingPost.body,
                                            tags: editingPost.tags?.join(', ') || '',
                                            userId: editingPost.userId
                                        }
                                        : { title: '', body: '', tags: '', userId: 1 }
                                }
                                isLoading={isCreating || isUpdating}
                                mode={editingPost ? 'edit' : 'create'}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No posts found. Create your first post!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isDeleting={isDeleting}
                            />
                        ))}

                        {hasMore && (
                            <div className="text-center pt-4">
                                {/* {isLoadingMore && (
                                    <div className="mb-2">
                                        <Skeleton className="h-4 w-32 mx-auto" />
                                    </div>
                                )} */}
                                <Button
                                    variant="outline"
                                    onClick={loadMore}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? 'Loading...' : 'Load More'}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 