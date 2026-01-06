export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string
  category: string
  publishedAt: string
  readingTime: number
  content?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
}
