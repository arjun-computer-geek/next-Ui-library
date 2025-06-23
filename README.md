# Next.js UI Library Template

A comprehensive Next.js template featuring a modern UI library built with **Tailwind CSS**, **shadcn/ui components**, and **comprehensive testing**. This template provides a solid foundation for building scalable web applications with best practices in place.

## ✨ Features

- **🎨 Modern UI Components** - Built with shadcn/ui and Tailwind CSS
- **🧪 Comprehensive Testing** - Jest + React Testing Library with 129 passing tests
- **📡 API Integration** - Custom Axios client with global error handling
- **🎯 Type Safety** - Full TypeScript support with Zod validation
- **📱 Responsive Design** - Mobile-first approach with custom hooks
- **🌙 Dark Mode** - Built-in theme switching
- **📊 State Management** - Zustand for client-side state
- **🔧 Developer Experience** - ESLint, Prettier, and optimized build setup

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd next-Ui-library

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── demo/             # Demo page with API examples
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── posts-crud.tsx   # Posts CRUD component
│   └── theme-provider.tsx
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and services
├── store/               # Zustand stores
├── types/               # TypeScript type definitions
└── __tests__/          # Test files
```

## 🧪 Testing

This template includes a comprehensive test suite with **129 passing tests** covering:

- **UI Components** - Button, Input, Card, Posts CRUD
- **Custom Hooks** - usePosts, useMobile
- **Utilities** - Validators, API Client
- **Integration Tests** - Component interactions

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

See [TESTING_README.md](./TESTING_README.md) for detailed testing documentation.

## 🎨 UI Components

### Available Components

- **Button** - Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Input** - Form inputs with validation support
- **Card** - Content containers with header, content, and footer
- **Dialog** - Modal dialogs and sheets
- **Navigation** - Menus and navigation components
- **Avatar** - User avatars and images
- **Dropdown** - Dropdown menus and selectors
- **Tooltip** - Hover tooltips
- **Skeleton** - Loading placeholders

### Usage Example

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <h2>My Form</h2>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter your name" />
        <Button variant="default">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## 📡 API Integration

### Custom Axios Client

The template includes a robust API client with:

- **Global Error Handling** - Centralized error management
- **Request/Response Interceptors** - Automatic token handling
- **Type Safety** - Full TypeScript support
- **Retry Logic** - Automatic retry on failures

### Usage Example

```tsx
import { apiClient } from "@/lib/api-client";

// GET request
const posts = await apiClient.get("/posts");

// POST request with validation
const newPost = await apiClient.post("/posts", {
  title: "My Post",
  body: "Post content",
  tags: ["tech", "nextjs"],
});
```

## 🎯 State Management

### Zustand Store

Simple and performant state management with Zustand:

```tsx
import { usePostStore } from "@/store/postStore";

function MyComponent() {
  const { posts, isLoading, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {isLoading
        ? "Loading..."
        : posts.map((post) => <div key={post.id}>{post.title}</div>)}
    </div>
  );
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_NAME=My App
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with:

- **Custom Colors** - Brand colors and semantic color tokens
- **Component Variants** - Predefined component styles
- **Responsive Utilities** - Mobile-first breakpoints

### ESLint & Prettier

Pre-configured with:

- **TypeScript Support** - Strict type checking
- **React Best Practices** - Hooks rules and accessibility
- **Import Sorting** - Organized imports
- **Code Formatting** - Consistent code style

## 📱 Responsive Design

### Mobile-First Approach

- **Custom Hooks** - `useMobile` for responsive logic
- **Breakpoint Utilities** - Tailwind responsive classes
- **Touch Interactions** - Mobile-optimized interactions

### Usage Example

```tsx
import { useMobile } from "@/hooks/use-mobile";

function ResponsiveComponent() {
  const isMobile = useMobile();

  return (
    <div className={isMobile ? "p-4" : "p-8"}>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
}
```

## 🌙 Theme System

### Dark Mode Support

Built-in theme switching with system preference detection:

```tsx
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggler } from "@/components/ThemeToggler";

function App() {
  return (
    <ThemeProvider>
      <ThemeToggler />
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify** - Static site generation
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Zustand](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [TESTING_README.md](./TESTING_README.md) for testing guidance
2. Review the demo pages for usage examples
3. Open an issue on GitHub

---

**Built with ❤️ using Next.js, Tailwind CSS, and shadcn/ui**
