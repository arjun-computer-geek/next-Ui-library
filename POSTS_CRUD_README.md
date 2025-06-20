# Posts CRUD Implementation

This document describes the comprehensive Posts CRUD (Create, Read, Update, Delete) implementation with proper Zod validation, API integration, and state management using modern React patterns.

## 🏗️ Architecture Overview

The implementation follows a clean architecture pattern with the following layers:

1. **API Layer** - Handles HTTP requests using axios with interceptors
2. **Service Layer** - Business logic and API endpoint management
3. **Store Layer** - State management using Zustand with persistence
4. **Hook Layer** - Custom React hooks for component integration
5. **UI Layer** - React components with form validation and modern UI

## 📁 File Structure

```
src/
├── lib/
│   ├── api-client.ts          # Axios instance with interceptors and error handling
│   ├── api-endpoints.ts       # API endpoint constants and query parameters
│   ├── post-service.ts        # Post-specific API service methods
│   ├── utils.ts               # Utility functions and helpers
│   └── validators.ts          # Zod schemas for validation and type safety
├── store/
│   └── postStore.ts           # Zustand store with persistence and devtools
├── hooks/
│   └── use-posts.ts           # Custom hook for posts operations with memoization
├── components/
│   ├── ui/                    # shadcn/ui components
│   └── posts-crud.tsx         # Main CRUD component with form handling
└── types/
    └── post.ts                # TypeScript type definitions
```

## ✨ Key Features

### 1. 🔒 Zod Validation

- Comprehensive validation schemas for all post operations
- Form validation with real-time error messages
- Type-safe data transformation and API responses
- Custom error messages for better UX

### 2. 🌐 API Integration

- Centralized API client with request/response interceptors
- Organized endpoint constants and query parameters
- Proper error handling with toast notifications
- Automatic token management and authentication

### 3. 📊 State Management

- Zustand store with persistence and devtools
- Loading states for all operations (create, read, update, delete, search)
- Error handling and user feedback
- Pagination support with infinite scroll
- Optimistic updates for better UX

### 4. 🎨 User Experience

- Toast notifications for success/error states
- Loading skeletons and spinners
- Search functionality with debouncing
- Responsive design with shadcn/ui components
- Form validation with real-time feedback

## 🔗 API Endpoints

The system uses the following API endpoints with proper query parameter handling:

```typescript
API_ENDPOINTS.POSTS = {
  BASE: "/posts",
  GET_ALL: "/posts",
  GET_BY_ID: (id: number) => `/posts/${id}`,
  CREATE: "/posts/add",
  UPDATE: (id: number) => `/posts/${id}`,
  DELETE: (id: number) => `/posts/${id}`,
  SEARCH: (query: string) => `/posts/search?q=${encodeURIComponent(query)}`,
};

API_QUERY_PARAMS.POSTS = {
  LIMIT: (limit: number) => `?limit=${limit}`,
  SKIP: (skip: number) => `?skip=${skip}`,
  SEARCH: (query: string) => `?q=${encodeURIComponent(query)}`,
  USER_ID: (userId: number) => `?userId=${userId}`,
  TAGS: (tags: string[]) => `?tags=${tags.join(",")}`,
};
```

## 🚀 Usage Examples

### Basic Component Usage

```tsx
import { PostsCrud } from "@/components/posts-crud";

function App() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Posts Management</h1>
      <PostsCrud />
    </div>
  );
}
```

### Using the Custom Hook

```tsx
import { usePosts } from "@/hooks/use-posts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function MyPostsComponent() {
  const {
    posts,
    isLoading,
    isCreating,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    loadMore,
    hasMore,
    error,
  } = usePosts();

  const handleCreatePost = async () => {
    const newPost = {
      title: "My New Post",
      body: "This is the content of my new post",
      tags: ["react", "typescript"],
      userId: 1,
    };

    const result = await createPost(newPost);
    if (result) {
      toast.success("Post created successfully!");
    }
  };

  const handleSearch = async (query: string) => {
    await searchPosts(query, 10);
  };

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div>
      <Button onClick={handleCreatePost} disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Post"}
      </Button>

      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}

      {hasMore && (
        <Button onClick={loadMore} variant="outline">
          Load More
        </Button>
      )}
    </div>
  );
}
```

### Using the Store Directly

```tsx
import { usePostStore } from "@/store/postStore";
import { useEffect } from "react";

function MyComponent() {
  const { posts, fetchPosts, createPost, isLoading, error } = usePostStore();

  useEffect(() => {
    fetchPosts({ limit: 10 });
  }, [fetchPosts]);

  const handleCreate = async () => {
    const newPost = {
      title: "Direct Store Usage",
      body: "Creating post directly through store",
      tags: ["zustand"],
      userId: 1,
    };

    await createPost(newPost);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <button onClick={handleCreate} disabled={isLoading}>
        Create Post
      </button>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## 📋 Validation Schemas

### Post Form Schema (for React Hook Form)

```typescript
export const postFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be less than 100 characters" }),
  body: z
    .string()
    .min(10, { message: "Body must be at least 10 characters long" })
    .max(1000, { message: "Body must be less than 1000 characters" }),
  tags: z.string().default(""),
  userId: z.number().positive({ message: "User ID must be a positive number" }),
});
```

### API Response Schemas

```typescript
export const postSchema = z.object({
  id: z.number(),
  title: z.string().min(3).max(100),
  body: z.string().min(10).max(1000),
  tags: z.array(z.string()).optional().default([]),
  reactions: z
    .object({
      likes: z.number().min(0),
      dislikes: z.number().min(0),
    })
    .optional()
    .default({ likes: 0, dislikes: 0 }),
  views: z.number().min(0).optional().default(0),
  userId: z.number().positive(),
});

export const postsResponseSchema = z.object({
  posts: z.array(postSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});
```

### Type Exports

```typescript
export type Post = z.infer<typeof postSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostFormValues = z.infer<typeof postFormSchema>;
export type PostsResponse = z.infer<typeof postsResponseSchema>;
```

## 🛡️ Error Handling

The system includes comprehensive error handling across all layers:

### 1. API Layer Errors

- **401 Unauthorized**: Automatic token removal and redirect
- **Network Errors**: Graceful fallback with user notifications
- **Validation Errors**: Field-specific error messages
- **Server Errors**: Generic error messages with toast notifications

### 2. Form Validation Errors

- Real-time validation feedback
- Field-specific error messages
- Form submission prevention on errors
- Clear error state management

### 3. State Management Errors

- Centralized error handling in Zustand store
- Error clearing on new operations
- Persistent error state with manual clearing
- Error boundaries for component-level protection

## ⏳ Loading States

Different loading states are managed for optimal UX:

```typescript
interface LoadingStates {
  isLoading: boolean; // Initial data loading
  isLoadingMore: boolean; // Pagination loading
  isCreating: boolean; // Create operation
  isUpdating: boolean; // Update operation
  isDeleting: boolean; // Delete operation
}
```

## 🎯 Core Features

### Create Post

- ✅ Form validation with Zod
- ✅ Real-time error feedback
- ✅ Success notifications
- ✅ Optimistic updates
- ✅ Loading states

### Read Posts

- ✅ Pagination support with infinite scroll
- ✅ Search functionality with debouncing
- ✅ Loading states and skeletons
- ✅ Empty state handling
- ✅ Error state management

### Update Post

- ✅ Pre-filled form with existing data
- ✅ Validation on update
- ✅ Optimistic updates
- ✅ Success/error notifications
- ✅ Loading states

### Delete Post

- ✅ Confirmation dialog
- ✅ Optimistic removal
- ✅ Error handling
- ✅ Success notifications
- ✅ Loading states

### Search

- ✅ Real-time search with debouncing
- ✅ Clear search functionality
- ✅ Search result highlighting
- ✅ Loading states
- ✅ Empty search results

## 🔧 Environment Setup

### Required Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://dummyjson.com

# Optional: Authentication
NEXT_PUBLIC_AUTH_ENABLED=false
NEXT_PUBLIC_AUTH_REDIRECT_URL=/login
```

### API Configuration

The system is configured to work with the DummyJSON API by default, but can be easily adapted to any REST API:

```typescript
// src/lib/api-client.ts
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

## 📦 Dependencies

### Core Dependencies

```json
{
  "axios": "^1.10.0", // HTTP client
  "zod": "^3.25.67", // Schema validation
  "zustand": "^5.0.5", // State management
  "react-hook-form": "^7.58.1", // Form handling
  "@hookform/resolvers": "^5.1.1", // Zod integration
  "sonner": "^2.0.5", // Toast notifications
  "lucide-react": "^0.518.0" // Icons
}
```

### UI Dependencies

```json
{
  "@radix-ui/react-dialog": "^1.1.14", // Dialog components
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "class-variance-authority": "^0.7.1", // Component variants
  "clsx": "^2.1.1", // Conditional classes
  "tailwind-merge": "^3.3.1" // Tailwind class merging
}
```

## 🧪 Testing

### Manual Testing Steps

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Navigate to Demo Page**

   - Visit `http://localhost:3000/demo`
   - Verify the Posts CRUD interface loads

3. **Test Create Operation**

   - Click "Add Post" button
   - Fill form with valid data
   - Submit and verify success notification
   - Check if post appears in list

4. **Test Read Operations**

   - Verify posts load on page load
   - Test pagination with "Load More"
   - Test search functionality
   - Verify loading states

5. **Test Update Operation**

   - Click edit button on any post
   - Modify data and submit
   - Verify success notification
   - Check if changes persist

6. **Test Delete Operation**

   - Click delete button on any post
   - Confirm deletion
   - Verify post disappears from list
   - Check success notification

7. **Test Error Handling**
   - Disconnect internet and test operations
   - Submit invalid form data
   - Verify appropriate error messages

### Automated Testing (Future Enhancement)

```typescript
// Example test structure
describe("Posts CRUD", () => {
  it("should create a new post", async () => {
    // Test implementation
  });

  it("should update an existing post", async () => {
    // Test implementation
  });

  it("should delete a post", async () => {
    // Test implementation
  });

  it("should search posts", async () => {
    // Test implementation
  });
});
```

## 🎨 UI Components

The implementation uses shadcn/ui components for a modern, accessible design:

### Available Components

- **Button**: Various variants (default, outline, ghost, destructive)
- **Card**: Content containers with headers and content areas
- **Dialog**: Modal dialogs for forms and confirmations
- **Input**: Form input fields with validation states
- **Skeleton**: Loading placeholders for better UX
- **Toast**: Notifications via Sonner integration
- **Navigation Menu**: Navigation components
- **Avatar**: User avatars and profile pictures
- **Dropdown Menu**: Context menus and actions
- **Tooltip**: Hover tooltips for better UX
- **Sheet**: Slide-out panels for mobile
- **Separator**: Visual dividers and spacing

### Component Usage Example

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ExampleComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm">
          Click me
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 🔄 State Management Patterns

### Zustand Store Structure

```typescript
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
  fetchPosts: (filters?: FilterOptions) => Promise<void>;
  createPost: (data: CreatePostInput) => Promise<Post | null>;
  updatePost: (id: number, data: UpdatePostInput) => Promise<Post | null>;
  deletePost: (id: number) => Promise<boolean>;
  searchPosts: (query: string, limit?: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}
```

### Store Features

- **Persistence**: Data persists across browser sessions
- **DevTools**: Full Redux DevTools integration
- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Loading States**: Granular loading states for each operation
- **Error Handling**: Centralized error management

## 🚀 Performance Optimizations

### React Optimizations

- **useCallback**: Memoized action handlers
- **useEffect**: Proper dependency arrays
- **React.memo**: Component memoization where needed
- **Lazy Loading**: Code splitting for better initial load

### API Optimizations

- **Request Caching**: Axios interceptors for caching
- **Debounced Search**: Prevents excessive API calls
- **Pagination**: Efficient data loading
- **Error Retry**: Automatic retry on network failures

### State Optimizations

- **Selective Updates**: Only update changed data
- **Batch Updates**: Group related state changes
- **Memory Management**: Cleanup on component unmount
- **Persistent Storage**: Efficient localStorage usage

## 🔮 Future Enhancements

### Planned Features

- **Bulk Operations**: Select multiple posts for batch actions
- **Advanced Filtering**: Filter by date, tags, user, etc.
- **Export Functionality**: Export posts to CSV/JSON
- **Real-time Updates**: WebSocket integration for live updates
- **Offline Support**: Service worker for offline functionality
- **Advanced Search**: Full-text search with filters
- **Image Upload**: Support for post images and attachments
- **Comments System**: Nested comments on posts
- **User Management**: User authentication and authorization
- **Analytics**: Post views, engagement metrics

### Technical Improvements

- **Unit Tests**: Comprehensive test coverage
- **E2E Tests**: End-to-end testing with Playwright
- **Performance Monitoring**: Real user monitoring
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: Multi-language support
- **PWA**: Progressive web app features
- **SSR/SSG**: Server-side rendering options
- **API Versioning**: Backward compatibility
- **Rate Limiting**: API call throttling
- **Caching Strategy**: Advanced caching patterns

## 📚 Best Practices

### Code Organization

1. **Separation of Concerns**: Clear separation between UI, logic, and data
2. **Type Safety**: Full TypeScript coverage with strict mode
3. **Error Boundaries**: Comprehensive error handling
4. **Performance**: Optimized re-renders and API calls
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **Responsive Design**: Mobile-first approach
7. **Security**: Input validation and sanitization
8. **Testing**: Unit and integration tests
9. **Documentation**: Comprehensive code documentation
10. **Code Review**: Peer review process

### Development Workflow

1. **Feature Branches**: Git flow for feature development
2. **Code Linting**: ESLint and Prettier configuration
3. **Type Checking**: Strict TypeScript configuration
4. **Build Optimization**: Next.js optimization features
5. **Deployment**: CI/CD pipeline integration
6. **Monitoring**: Error tracking and performance monitoring
7. **Backup**: Regular data backup and recovery
8. **Security**: Regular security audits and updates
9. **Performance**: Regular performance audits
10. **User Feedback**: Continuous user feedback integration

This implementation provides a solid foundation for building scalable, maintainable React applications with modern best practices and excellent developer experience.
