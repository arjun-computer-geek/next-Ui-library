import { useEffect, useCallback } from 'react';
import { usePostStore } from '@/store/postStore';
import type { CreatePostInput, UpdatePostInput } from '@/lib/validators';

export const usePosts = () => {
  const {
    posts,
    currentPost,
    isLoading,
    isLoadingMore,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    total,
    skip,
    limit,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    clearError,
    reset,
  } = usePostStore();

  // Load posts on mount
  useEffect(() => {
    fetchPosts({ limit: 10 });
  }, [fetchPosts]);

  // Memoized actions
  const handleCreatePost = useCallback(
    async (data: CreatePostInput) => {
      const result = await createPost(data);
      return result;
    },
    [createPost]
  );

  const handleUpdatePost = useCallback(
    async (id: number, data: UpdatePostInput) => {
      const result = await updatePost(id, data);
      return result;
    },
    [updatePost]
  );

  const handleDeletePost = useCallback(
    async (id: number) => {
      const result = await deletePost(id);
      return result;
    },
    [deletePost]
  );

  const handleSearchPosts = useCallback(
    async (query: string, limit?: number) => {
      await searchPosts(query, limit);
    },
    [searchPosts]
  );

  const handleLoadMore = useCallback(
    async () => {
      await fetchPosts({ limit: 10, skip: posts.length });
    },
    [fetchPosts, posts.length]
  );

  const handleRefresh = useCallback(
    async () => {
      await fetchPosts({ limit: 10 });
    },
    [fetchPosts]
  );

  return {
    // Data
    posts,
    currentPost,
    
    // Loading states
    isLoading,
    isLoadingMore,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Error state
    error,
    
    // Pagination
    total,
    skip,
    limit,
    hasMore: posts.length < total,
    
    // Actions
    createPost: handleCreatePost,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
    searchPosts: handleSearchPosts,
    loadMore: handleLoadMore,
    refresh: handleRefresh,
    clearError,
    reset,
  };
}; 