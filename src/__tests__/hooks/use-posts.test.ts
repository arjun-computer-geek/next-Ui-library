import { renderHook, act } from '@testing-library/react'
import { usePosts } from '@/hooks/use-posts'
import { mockPosts } from '../setup'

// Mock the post store
const mockStore = {
  posts: mockPosts,
  currentPost: null as typeof mockPosts[0] | null,
  isLoading: false,
  isLoadingMore: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null as string | null,
  total: mockPosts.length,
  skip: 0,
  limit: 10,
  fetchPosts: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  searchPosts: jest.fn(),
  clearError: jest.fn(),
  reset: jest.fn(),
}

jest.mock('@/store/postStore', () => ({
  usePostStore: () => mockStore,
}))

describe('usePosts Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('returns correct initial state', () => {
      const { result } = renderHook(() => usePosts())

      expect(result.current.posts).toEqual(mockPosts)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.total).toBe(mockPosts.length)
      expect(result.current.hasMore).toBe(false)
    })

    it('provides all required properties', () => {
      const { result } = renderHook(() => usePosts())

      expect(result.current).toHaveProperty('posts')
      expect(result.current).toHaveProperty('currentPost')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('isLoadingMore')
      expect(result.current).toHaveProperty('isCreating')
      expect(result.current).toHaveProperty('isUpdating')
      expect(result.current).toHaveProperty('isDeleting')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('total')
      expect(result.current).toHaveProperty('skip')
      expect(result.current).toHaveProperty('limit')
      expect(result.current).toHaveProperty('hasMore')
    })

    it('provides all required actions', () => {
      const { result } = renderHook(() => usePosts())

      expect(result.current).toHaveProperty('createPost')
      expect(result.current).toHaveProperty('updatePost')
      expect(result.current).toHaveProperty('deletePost')
      expect(result.current).toHaveProperty('searchPosts')
      expect(result.current).toHaveProperty('loadMore')
      expect(result.current).toHaveProperty('refresh')
      expect(result.current).toHaveProperty('clearError')
      expect(result.current).toHaveProperty('reset')
    })
  })

  describe('Hook Actions', () => {
    it('creates post successfully', async () => {
      const { result } = renderHook(() => usePosts())

      const newPost = {
        title: 'Test Post',
        body: 'Test content',
        tags: ['test'],
        userId: 1,
      }

      mockStore.createPost.mockResolvedValue({ id: 999, ...newPost })

      await act(async () => {
        await result.current.createPost(newPost)
      })

      expect(mockStore.createPost).toHaveBeenCalledWith(newPost)
    })

    it('updates post successfully', async () => {
      const { result } = renderHook(() => usePosts())

      const updateData = {
        id: 1,
        title: 'Updated Post',
      }

      mockStore.updatePost.mockResolvedValue(updateData)

      await act(async () => {
        await result.current.updatePost(1, updateData)
      })

      expect(mockStore.updatePost).toHaveBeenCalledWith(1, updateData)
    })

    it('deletes post successfully', async () => {
      const { result } = renderHook(() => usePosts())

      mockStore.deletePost.mockResolvedValue(true)

      await act(async () => {
        await result.current.deletePost(1)
      })

      expect(mockStore.deletePost).toHaveBeenCalledWith(1)
    })

    it('searches posts successfully', async () => {
      const { result } = renderHook(() => usePosts())

      await act(async () => {
        await result.current.searchPosts('test')
      })

      expect(mockStore.searchPosts).toHaveBeenCalledWith('test', undefined)
    })

    it('loads more posts successfully', async () => {
      const { result } = renderHook(() => usePosts())

      await act(async () => {
        await result.current.loadMore()
      })

      expect(mockStore.fetchPosts).toHaveBeenLastCalledWith({ limit: 10, skip: 2 })
    })

    it('refreshes posts successfully', async () => {
      const { result } = renderHook(() => usePosts())

      await act(async () => {
        await result.current.refresh()
      })

      expect(mockStore.fetchPosts).toHaveBeenCalledWith({ limit: 10 })
    })

    it('clears error successfully', () => {
      const { result } = renderHook(() => usePosts())

      act(() => {
        result.current.clearError()
      })

      expect(mockStore.clearError).toHaveBeenCalled()
    })

    it('resets store successfully', () => {
      const { result } = renderHook(() => usePosts())

      act(() => {
        result.current.reset()
      })

      expect(mockStore.reset).toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('reflects loading state from store', () => {
      mockStore.isLoading = true
      const { result } = renderHook(() => usePosts())

      expect(result.current.isLoading).toBe(true)
    })

    it('reflects creating state from store', () => {
      mockStore.isCreating = true
      const { result } = renderHook(() => usePosts())

      expect(result.current.isCreating).toBe(true)
    })

    it('reflects updating state from store', () => {
      mockStore.isUpdating = true
      const { result } = renderHook(() => usePosts())

      expect(result.current.isUpdating).toBe(true)
    })

    it('reflects deleting state from store', () => {
      mockStore.isDeleting = true
      const { result } = renderHook(() => usePosts())

      expect(result.current.isDeleting).toBe(true)
    })

    it('reflects loading more state from store', () => {
      mockStore.isLoadingMore = true
      const { result } = renderHook(() => usePosts())

      expect(result.current.isLoadingMore).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('reflects error state from store', () => {
      const errorMessage = 'Something went wrong'
      mockStore.error = errorMessage
      const { result } = renderHook(() => usePosts())

      expect(result.current.error).toBe(errorMessage)
    })
  })

  describe('Pagination', () => {
    it('calculates hasMore correctly', () => {
      mockStore.posts = mockPosts.slice(0, 5)
      mockStore.total = 10
      const { result } = renderHook(() => usePosts())

      expect(result.current.hasMore).toBe(true)
    })

    it('calculates hasMore as false when all posts loaded', () => {
      mockStore.posts = mockPosts
      mockStore.total = mockPosts.length
      const { result } = renderHook(() => usePosts())

      expect(result.current.hasMore).toBe(false)
    })

    it('provides correct pagination values', () => {
      mockStore.skip = 10
      mockStore.limit = 20
      mockStore.total = 100
      const { result } = renderHook(() => usePosts())

      expect(result.current.skip).toBe(10)
      expect(result.current.limit).toBe(20)
      expect(result.current.total).toBe(100)
    })
  })

  describe('Data Updates', () => {
    it('reflects posts updates from store', () => {
      const newPosts = [...mockPosts, { 
        id: 999, 
        title: 'New Post', 
        body: 'Content', 
        tags: ['new'], 
        userId: 1,
        reactions: { likes: 0, dislikes: 0 },
        views: 0
      }]
      mockStore.posts = newPosts
      const { result } = renderHook(() => usePosts())

      expect(result.current.posts).toEqual(newPosts)
    })

    it('reflects current post updates from store', () => {
      const currentPost = mockPosts[0]
      mockStore.currentPost = currentPost
      const { result } = renderHook(() => usePosts())

      expect(result.current.currentPost).toEqual(currentPost)
    })
  })
}) 