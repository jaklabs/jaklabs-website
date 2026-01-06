import { v4 as uuidv4 } from 'uuid'

export function generateId(): string {
  return uuidv4()
}

export function generateSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 100)
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

export function formatDateKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0] + '#' + d.getTime()
}

export function getUserFromEvent(event: any): { userId: string; email: string; groups: string[] } | null {
  const claims = event.requestContext?.authorizer?.claims
  if (!claims) return null
  return { userId: claims.sub, email: claims.email, groups: claims['cognito:groups']?.split(',') || [] }
}

export function isAdmin(event: any): boolean {
  const user = getUserFromEvent(event)
  return user?.groups.includes('Admins') || false
}

export function sanitizeHtml(html: string): string {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/on\w+="[^"]*"/gi, '')
}

export function validateRequired(data: Record<string, any>, requiredFields: string[]): { valid: boolean; missing: string[] } {
  const missing = requiredFields.filter(field => data[field] === undefined || data[field] === null || data[field] === '')
  return { valid: missing.length === 0, missing }
}
