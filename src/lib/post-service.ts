import { ApiService } from './api-client';
import { API_ENDPOINTS, API_QUERY_PARAMS } from './api-endpoints';
import type { 
  Post, 
  CreatePostInput, 
  UpdatePostInput, 
  PostsResponse
} from './validators';

export class PostService {
  // Get all posts with optional filters
  static async getPosts(filters?: {
    limit?: number;
    skip?: number;
    search?: string;
    userId?: number;
    tags?: string[];
  }): Promise<PostsResponse> {
    let url = API_ENDPOINTS.POSTS.GET_ALL;
    const params: string[] = [];

    if (filters?.limit) {
      params.push(API_QUERY_PARAMS.POSTS.LIMIT(filters.limit));
    }
    if (filters?.skip) {
      params.push(API_QUERY_PARAMS.POSTS.SKIP(filters.skip));
    }
    if (filters?.search) {
      params.push(API_QUERY_PARAMS.POSTS.SEARCH(filters.search));
    }
    if (filters?.userId) {
      params.push(API_QUERY_PARAMS.POSTS.USER_ID(filters.userId));
    }
    if (filters?.tags && filters.tags.length > 0) {
      params.push(API_QUERY_PARAMS.POSTS.TAGS(filters.tags));
    }

    if (params.length > 0) {
      url += params.join('&').replace('?', '&').replace('&', '?');
    }

    // The API returns data directly
    return ApiService.get<PostsResponse>(url);
  }

  // Get a single post by ID
  static async getPost(id: number): Promise<Post> {
    return ApiService.get<Post>(API_ENDPOINTS.POSTS.GET_BY_ID(id));
  }

  // Create a new post
  static async createPost(data: CreatePostInput): Promise<Post> {
    return ApiService.post<Post>(API_ENDPOINTS.POSTS.CREATE, data);
  }

  // Update an existing post
  static async updatePost(id: number, data: UpdatePostInput): Promise<Post> {
    return ApiService.put<Post>(API_ENDPOINTS.POSTS.UPDATE(id), data);
  }

  // Delete a post
  static async deletePost(id: number): Promise<{ success: boolean }> {
    await ApiService.delete<{ success: boolean }>(API_ENDPOINTS.POSTS.DELETE(id));
    return { success: true };
  }

  // Search posts
  static async searchPosts(query: string, limit?: number): Promise<PostsResponse> {
    let url = API_ENDPOINTS.POSTS.SEARCH(query);
    if (limit) {
      url += `&limit=${limit}`;
    }
    return ApiService.get<PostsResponse>(url);
  }
} 