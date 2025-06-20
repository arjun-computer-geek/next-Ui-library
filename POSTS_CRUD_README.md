# Posts CRUD Implementation

This document describes the comprehensive Posts CRUD (Create, Read, Update, Delete) implementation with proper Zod validation, API integration, and state management.

## Architecture Overview

The implementation follows a clean architecture pattern with the following layers:

1. **API Layer** - Handles HTTP requests using axios
2. **Service Layer** - Business logic and API endpoint management
3. **Store Layer** - State management using Zustand
4. **UI Layer** - React components with form validation

## File Structure

```
src/
├── lib/
│   ├── api-client.ts          # Axios instance with interceptors
│   ├── api-endpoints.ts       # API endpoint constants
│   ├── post-service.ts        # Post-specific API service
│   └── validators.ts          # Zod schemas for validation
├── store/
│   └── postStore.ts           # Zustand store for posts
├── hooks/
│   └── use-posts.ts           # Custom hook for posts operations
├── components/
│   └── posts-crud.tsx         # Main CRUD component
└── types/
    └── post.ts                # TypeScript type definitions
```

## Key Features

### 1. Zod Validation

- Comprehensive validation schemas for all post operations
- Form validation with real-time error messages
- Type-safe data transformation

### 2. API Integration

- Centralized API client with interceptors
- Organized endpoint constants
- Proper error handling and response typing

### 3. State Management

- Zustand store with persistence
- Loading states for all operations
- Error handling and user feedback
- Pagination support

### 4. User Experience

- Toast notifications for success/error states
- Loading skeletons
- Search functionality
- Responsive design

## API Endpoints

The system uses the following API endpoints:

```typescript
API_ENDPOINTS.POSTS = {
  BASE: "/posts",
  GET_ALL: "/posts",
  GET_BY_ID: (id: number) => `/posts/${id}`,
  CREATE: "/posts/add",
  UPDATE: (id: number) => `/posts/${id}`,
  DELETE: (id: number) => `/posts/${id}`,
  SEARCH: (query: string) => `/posts/search?q=${query}`,
};
```

## Usage

### Basic Usage

```tsx
import { PostsCrud } from "@/components/posts-crud";

function App() {
  return (
    <div>
      <PostsCrud />
    </div>
  );
}
```

### Using the Custom Hook

```tsx
import { usePosts } from "@/hooks/use-posts";

function MyComponent() {
  const { posts, isLoading, createPost, updatePost, deletePost, searchPosts } =
    usePosts();

  // Use the hook methods
}
```

### Using the Store Directly

```tsx
import { usePostStore } from "@/store/postStore";

function MyComponent() {
  const { posts, fetchPosts, createPost } = usePostStore();

  // Use store methods
}
```

## Validation Schemas

### Post Form Schema

```typescript
export const postFormSchema = z.object({
  title: z.string().min(3).max(100),
  body: z.string().min(10).max(1000),
  tags: z.string().default(""),
  userId: z.number().positive(),
});
```

### API Response Schemas

```typescript
export const postsResponseSchema = z.object({
  posts: z.array(postSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});
```

## Error Handling

The system includes comprehensive error handling:

1. **API Errors** - Handled by axios interceptors
2. **Validation Errors** - Displayed in form fields
3. **Network Errors** - Toast notifications
4. **State Errors** - Managed in the store

## Loading States

Different loading states are managed for:

- Initial data loading
- Creating posts
- Updating posts
- Deleting posts
- Searching posts

## Features

### Create Post

- Form validation with Zod
- Real-time error feedback
- Success notifications

### Read Posts

- Pagination support
- Search functionality
- Loading states
- Empty state handling

### Update Post

- Pre-filled form with existing data
- Validation on update
- Optimistic updates

### Delete Post

- Confirmation dialog
- Optimistic removal
- Error handling

### Search

- Real-time search
- Debounced input
- Clear search functionality

## Environment Setup

Make sure to set the API URL in your environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

## Dependencies

The implementation uses the following key dependencies:

- `axios` - HTTP client
- `zod` - Schema validation
- `zustand` - State management
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Zod integration
- `sonner` - Toast notifications

## Testing

To test the implementation:

1. Start the development server: `npm run dev`
2. Navigate to `/demo` to see the CRUD interface
3. Test all operations: create, read, update, delete, search

## Best Practices

1. **Type Safety** - All data is properly typed with TypeScript
2. **Error Boundaries** - Comprehensive error handling
3. **Performance** - Optimized re-renders with proper memoization
4. **Accessibility** - Proper ARIA labels and keyboard navigation
5. **Responsive Design** - Works on all screen sizes

## Future Enhancements

Potential improvements:

- Bulk operations
- Advanced filtering
- Export functionality
- Real-time updates
- Offline support
- Advanced search with filters
