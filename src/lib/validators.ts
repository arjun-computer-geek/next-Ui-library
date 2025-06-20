import { z } from 'zod';

// Base post schema for API responses
export const postSchema = z.object({
  id: z.number(),
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }).max(100, { message: 'Title must be less than 100 characters' }),
  body: z.string().min(10, { message: 'Body must be at least 10 characters long' }).max(1000, { message: 'Body must be less than 1000 characters' }),
  tags: z.array(z.string().min(1, { message: 'Tag cannot be empty' })).optional().default([]),
  reactions: z.object({
    likes: z.number().min(0),
    dislikes: z.number().min(0),
  }).optional().default({ likes: 0, dislikes: 0 }),
  views: z.number().min(0).optional().default(0),
  userId: z.number().positive({ message: 'User ID must be a positive number' }),
});

// Schema for creating a new post
export const createPostSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }).max(100, { message: 'Title must be less than 100 characters' }),
  body: z.string().min(10, { message: 'Body must be at least 10 characters long' }).max(1000, { message: 'Body must be less than 1000 characters' }),
  tags: z.array(z.string().min(1, { message: 'Tag cannot be empty' })).optional().default([]),
  userId: z.number().positive({ message: 'User ID must be a positive number' }),
});

// Schema for updating a post
export const updatePostSchema = z.object({
  id: z.number().positive({ message: 'Post ID must be a positive number' }),
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }).max(100, { message: 'Title must be less than 100 characters' }).optional(),
  body: z.string().min(10, { message: 'Body must be at least 10 characters long' }).max(1000, { message: 'Body must be less than 1000 characters' }).optional(),
  tags: z.array(z.string().min(1, { message: 'Tag cannot be empty' })).optional(),
  userId: z.number().positive({ message: 'User ID must be a positive number' }).optional(),
});

// Schema for form values (used in React Hook Form)
export const postFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }).max(100, { message: 'Title must be less than 100 characters' }),
  body: z.string().min(10, { message: 'Body must be at least 10 characters long' }).max(1000, { message: 'Body must be less than 1000 characters' }),
  tags: z.string(),
  userId: z.number().positive({ message: 'User ID must be a positive number' }),
});

// API response schemas
export const postsResponseSchema = z.object({
  posts: z.array(postSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

// Type exports
export type Post = z.infer<typeof postSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostFormValues = z.infer<typeof postFormSchema>;
export type PostsResponse = z.infer<typeof postsResponseSchema>; 