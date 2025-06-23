// Mock data for tests
export const mockPosts = [
  {
    id: 1,
    title: 'Test Post 1',
    body: 'This is test post 1 content',
    tags: ['test', 'example'],
    userId: 1,
    reactions: {
      likes: 5,
      dislikes: 1,
    },
    views: 100,
  },
  {
    id: 2,
    title: 'Test Post 2',
    body: 'This is test post 2 content',
    tags: ['test', 'demo'],
    userId: 2,
    reactions: {
      likes: 3,
      dislikes: 0,
    },
    views: 50,
  },
]

export const mockPostFormData = {
  title: 'Test Post',
  body: 'This is a test post content',
  tags: 'test,example',
  userId: 1,
} 