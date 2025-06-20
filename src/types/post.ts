// Import types from validators
import type { Post, PostFormValues } from '@/lib/validators';

// Re-export types from validators for consistency
export type { Post, CreatePostInput, UpdatePostInput, PostFormValues, PostsResponse } from '@/lib/validators';

// Additional types for UI components
export interface PostListItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export interface PostFormProps {
  onSubmit: (data: PostFormValues) => void;
  defaultValues: PostFormValues;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

export interface PostFilters {
  search?: string;
  userId?: number;
  tags?: string[];
  limit?: number;
  skip?: number;
}


