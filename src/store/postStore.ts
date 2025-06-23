import { Post, CreatePostInput, UpdatePostInput } from '@/lib/validators';
import { PostService } from '@/lib/post-service';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface PostState {
  // Data
  posts: Post[];
  currentPost: Post | null;
  
  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error state
  error: string | null;
  
  // Pagination
  total: number;
  skip: number;
  limit: number;
  
  // Actions
  setPosts: (posts: Post[]) => void;
  setCurrentPost: (post: Post | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  // API Actions
  fetchPosts: (filters?: {
    limit?: number;
    skip?: number;
    search?: string;
    userId?: number;
    tags?: string[];
  }) => Promise<void>;
  
  fetchPost: (id: number) => Promise<void>;
  
  createPost: (data: CreatePostInput) => Promise<Post | null>;
  
  updatePost: (id: number, data: UpdatePostInput) => Promise<Post | null>;
  
  deletePost: (id: number) => Promise<boolean>;
  
  searchPosts: (query: string, limit?: number) => Promise<void>;
  
  // Utility actions
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  isLoadingMore: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  total: 0,
  skip: 0,
  limit: 10,
};

export const usePostStore = create<PostState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setPosts: (posts) => set({ posts }),
        setCurrentPost: (post) => set({ currentPost: post }),
        setError: (error) => set({ error }),
        setLoading: (loading) => set({ isLoading: loading }),
        
        fetchPosts: async (filters) => {
          try {
            if (filters?.skip) {
              set({ isLoadingMore: true, error: null });
            } else {
              set({ isLoading: true, error: null });
            }
            
            const response = await PostService.getPosts(filters);
            
            set((state) => ({
              posts: filters?.skip ? [...state.posts, ...response.posts] : response.posts,
              total: response.total,
              skip: response.skip,
              limit: response.limit,
            }));

          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts';
            set({ error: errorMessage });
          } finally {
            if (filters?.skip) {
              set({ isLoadingMore: false });
            } else {
              set({ isLoading: false });
            }
          }
        },
        
        fetchPost: async (id) => {
          try {
            set({ isLoading: true, error: null });
            const response = await PostService.getPost(id);
            set({ currentPost: response });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch post';
            set({ error: errorMessage });
          } finally {
            set({ isLoading: false });
          }
        },
        
        createPost: async (data) => {
          try {
            set({ isCreating: true, error: null });
            const response = await PostService.createPost(data);
            set((state) => ({
              posts: [response, ...state.posts],
              currentPost: response,
            }));
            return response;
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
            set({ error: errorMessage });
            return null;
          } finally {
            set({ isCreating: false });
          }
        },
        
        updatePost: async (id, data) => {
          try {
            set({ isUpdating: true, error: null });
            const response = await PostService.updatePost(id, data);
            set((state) => ({
              posts: state.posts.map((post) =>
                post.id === id ? response : post
              ),
              currentPost: state.currentPost?.id === id ? response : state.currentPost,
            }));
            return response;
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
            set({ error: errorMessage });
            return null;
          } finally {
            set({ isUpdating: false });
          }
        },
        
        deletePost: async (id) => {
          try {
            set({ isDeleting: true, error: null });
            await PostService.deletePost(id);
            set((state) => ({
              posts: state.posts.filter((post) => post.id !== id),
              currentPost: state.currentPost?.id === id ? null : state.currentPost,
            }));
            return true;
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
            set({ error: errorMessage });
            return false;
          } finally {
            set({ isDeleting: false });
          }
        },
        
        searchPosts: async (query, limit) => {
          try {
            set({ isLoading: true, error: null });
            const response = await PostService.searchPosts(query, limit);
            
            // The API now returns data directly
            set({
              posts: response.posts,
              total: response.total,
              skip: response.skip,
              limit: response.limit,
            });
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to search posts';
            set({ error: errorMessage });
          } finally {
            set({ isLoading: false });
          }
        },
        
        clearError: () => set({ error: null }),
        reset: () => set(initialState),
      }),
      {
        name: 'post-store',
        partialize: (state) => ({
          posts: state.posts,
          currentPost: state.currentPost,
          total: state.total,
          skip: state.skip,
          limit: state.limit,
        }),
      }
    )
  )
);