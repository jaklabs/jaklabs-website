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

export interface Category {
    id: string
    name: string
    slug: string
}

export const categories: Category[] = [
    { id: '1', name: 'Marketing', slug: 'marketing' },
    { id: '2', name: 'Development', slug: 'development' },
    { id: '3', name: 'Design', slug: 'design' },
    { id: '4', name: 'Business', slug: 'business' },
]

const blogPosts: BlogPost[] = [
    {
        id: '1',
        slug: 'boost-your-local-seo',
        title: '10 Ways to Boost Your Local SEO and Attract More Customers',
        excerpt: 'Learn the proven strategies that help service businesses dominate local search results and bring in more qualified leads.',
        coverImage: '/images/blog/seo.jpg',
        category: 'Marketing',
        publishedAt: '2024-01-15',
        readingTime: 8,
    },
    {
        id: '2',
        slug: 'mobile-app-benefits',
        title: 'Why Every Service Business Needs a Mobile App in 2024',
        excerpt: 'Discover how a custom mobile app can streamline operations, improve customer satisfaction, and increase revenue.',
        coverImage: '/images/blog/mobile-app.jpg',
        category: 'Development',
        publishedAt: '2024-01-10',
        readingTime: 6,
    },
    {
        id: '3',
        slug: 'brand-identity-guide',
        title: 'Building a Strong Brand Identity for Your Service Business',
        excerpt: 'A comprehensive guide to creating a memorable brand that resonates with your target audience.',
        coverImage: '/images/blog/branding.jpg',
        category: 'Design',
        publishedAt: '2024-01-05',
        readingTime: 10,
    },
    {
        id: '4',
        slug: 'customer-retention-strategies',
        title: 'Customer Retention Strategies That Actually Work',
        excerpt: 'Keep your customers coming back with these proven retention tactics for service-based businesses.',
        coverImage: '/images/blog/retention.jpg',
        category: 'Business',
        publishedAt: '2024-01-01',
        readingTime: 7,
    },
    {
        id: '5',
        slug: 'social-media-marketing',
        title: 'Social Media Marketing for Local Businesses',
        excerpt: 'Master the art of social media to connect with your local community and grow your customer base.',
        coverImage: '/images/blog/social.jpg',
        category: 'Marketing',
        publishedAt: '2023-12-28',
        readingTime: 9,
    },
    {
        id: '6',
        slug: 'website-conversion-tips',
        title: 'Turn Website Visitors into Paying Customers',
        excerpt: 'Optimize your website for conversions with these actionable tips and best practices.',
        coverImage: '/images/blog/conversion.jpg',
        category: 'Development',
        publishedAt: '2023-12-20',
        readingTime: 5,
    },
]

export function getBlogPosts(): BlogPost[] {
    return blogPosts
}

export function getBlogPost(slug: string): BlogPost | undefined {
    return blogPosts.find(post => post.slug === slug)
}
