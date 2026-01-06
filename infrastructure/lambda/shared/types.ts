export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  authorId: string
  authorName: string
  readingTime: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
  PK: string
  SK: string
  GSI1PK?: string
  GSI1SK?: string
  GSI2PK?: string
  GSI2SK?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBlogInput {
  title: string
  excerpt: string
  content: string
  coverImage?: string
  category: string
  tags?: string[]
  status?: 'draft' | 'published'
}

export interface UpdateBlogInput {
  title?: string
  excerpt?: string
  content?: string
  coverImage?: string
  category?: string
  tags?: string[]
  status?: 'draft' | 'published'
}

export interface ApiResponse<T = any> {
  statusCode: number
  headers: Record<string, string>
  body: string
}

export interface PaginatedResponse<T> {
  items: T[]
  nextToken?: string
  count: number
}

export interface UploadUrlRequest {
  fileName: string
  contentType: string
  folder?: string
}

export interface UploadUrlResponse {
  uploadUrl: string
  key: string
  publicUrl: string
}
