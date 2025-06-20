// API Endpoint constants
export const API_ENDPOINTS = {
  POSTS: {
    BASE: '/posts',
    GET_ALL: '/posts',
    GET_BY_ID: (id: number) => `/posts/${id}`,
    CREATE: '/posts/add',
    UPDATE: (id: number) => `/posts/${id}`,
    DELETE: (id: number) => `/posts/${id}`,
    SEARCH: (query: string) => `/posts/search?q=${encodeURIComponent(query)}`,
  },
  USERS: {
    BASE: '/users',
    GET_ALL: '/users',
    GET_BY_ID: (id: number) => `/users/${id}`,
    CREATE: '/users/add',
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
  },
} as const;

// API Query parameters
export const API_QUERY_PARAMS = {
  POSTS: {
    LIMIT: (limit: number) => `?limit=${limit}`,
    SKIP: (skip: number) => `?skip=${skip}`,
    SEARCH: (query: string) => `?q=${encodeURIComponent(query)}`,
    USER_ID: (userId: number) => `?userId=${userId}`,
    TAGS: (tags: string[]) => `?tags=${tags.join(',')}`,
  },
} as const; 