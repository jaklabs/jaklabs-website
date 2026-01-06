export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  author: {
    name: string
    avatar: string
  }
  category: string
  tags: string[]
  publishedAt: string
  readingTime: number
  featured?: boolean
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  count: number
}
