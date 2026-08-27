import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { success, created, noContent, error, notFound, validationError, serverError } from '../shared/response'
import { generateId, generateSlug, getCurrentTimestamp, validateRequired } from '../shared/utils'
import { Category } from '../shared/types'

/**
 * Blog categories.
 *
 * The table, its slug index and the Lambda's write permission on it have
 * existed since January; nothing ever read or wrote it, and the website carried
 * four categories hardcoded in `src/lib/blog-data.ts` instead. A table with no
 * code path is worse than no table — it looks like a feature.
 *
 * Categories are their OWN entity rather than a distinct-values query over
 * posts, because the useful ones do not exist yet. Writing to rank for "med spa
 * software in Michigan" means creating that category before the first post in
 * it, and a derived list cannot hold an empty category.
 */

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client, { marshallOptions: { removeUndefinedValues: true } })
const CATEGORIES_TABLE = process.env.CATEGORIES_TABLE!

async function bySlug(slug: string): Promise<Category | null> {
  const res = await docClient.send(new QueryCommand({
    TableName: CATEGORIES_TABLE,
    IndexName: 'SlugIndex',
    KeyConditionExpression: 'slug = :slug',
    ExpressionAttributeValues: { ':slug': slug },
    Limit: 1,
  }))
  return (res.Items?.[0] as Category) || null
}

export async function listCategories(): Promise<APIGatewayProxyResult> {
  try {
    // A blog has tens of categories, not thousands, and there is no sensible
    // partition key to query them by. A scan is the honest primitive here.
    const items: Category[] = []
    let ExclusiveStartKey: Record<string, any> | undefined
    do {
      const res = await docClient.send(new ScanCommand({ TableName: CATEGORIES_TABLE, ExclusiveStartKey }))
      items.push(...((res.Items as Category[]) || []))
      ExclusiveStartKey = res.LastEvaluatedKey
    } while (ExclusiveStartKey)

    items.sort((a, b) => a.name.localeCompare(b.name))
    return success({ items, count: items.length })
  } catch (err) {
    console.error('listCategories:', err)
    return serverError('Could not list categories')
  }
}

export async function createCategory(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const body = JSON.parse(event.body || '{}')
    const validation = validateRequired(body, ['name'])
    if (!validation.valid) return validationError('Missing required fields', { missing: validation.missing })

    const slug = body.slug ? generateSlug(body.slug) : generateSlug(body.name)
    if (!slug) return validationError('Name must contain at least one letter or number')

    // The slug is what a URL is built from, so a duplicate is a conflict rather
    // than a second row — two categories at /blog/category/seo cannot both win.
    if (await bySlug(slug)) return error(`A category with the slug "${slug}" already exists`, 409)

    const now = getCurrentTimestamp()
    const category: Category = {
      id: generateId(),
      name: String(body.name).trim(),
      slug,
      description: body.description ? String(body.description).trim() : undefined,
      createdAt: now,
      updatedAt: now,
    }

    await docClient.send(new PutCommand({
      TableName: CATEGORIES_TABLE,
      Item: category,
      ConditionExpression: 'attribute_not_exists(id)',
    }))
    return created(category)
  } catch (err) {
    console.error('createCategory:', err)
    return serverError('Could not create the category')
  }
}

export async function updateCategory(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const slug = event.pathParameters?.slug
    if (!slug) return validationError('Slug is required')

    const existing = await bySlug(slug)
    if (!existing) return notFound('Category')

    const body = JSON.parse(event.body || '{}')
    const updates: string[] = ['updatedAt = :updatedAt']
    const values: Record<string, any> = { ':updatedAt': getCurrentTimestamp() }
    const names: Record<string, string> = {}

    if (body.name !== undefined) {
      names['#name'] = 'name'
      updates.push('#name = :name')
      values[':name'] = String(body.name).trim()
    }
    if (body.description !== undefined) {
      updates.push('description = :description')
      values[':description'] = String(body.description).trim()
    }

    // The slug is deliberately NOT updatable. Changing it breaks every link
    // already published to that category, which is the opposite of what a blog
    // written for search is for. Delete and recreate if it truly must change.
    if (body.slug !== undefined && generateSlug(body.slug) !== existing.slug) {
      return error('A category slug cannot be changed — published URLs depend on it', 409)
    }

    const res = await docClient.send(new UpdateCommand({
      TableName: CATEGORIES_TABLE,
      Key: { id: existing.id },
      UpdateExpression: 'SET ' + updates.join(', '),
      ExpressionAttributeValues: values,
      ...(Object.keys(names).length ? { ExpressionAttributeNames: names } : {}),
      ReturnValues: 'ALL_NEW',
    }))
    return success(res.Attributes)
  } catch (err) {
    console.error('updateCategory:', err)
    return serverError('Could not update the category')
  }
}

export async function deleteCategory(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const slug = event.pathParameters?.slug
    if (!slug) return validationError('Slug is required')

    const existing = await bySlug(slug)
    if (!existing) return notFound('Category')

    // Refuse while posts still point at it. Deleting anyway would leave posts
    // filed under a category that no longer exists, and the blog list filters
    // by exactly that string.
    const inUse = await docClient.send(new QueryCommand({
      TableName: process.env.BLOGS_TABLE!,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :pk',
      ExpressionAttributeValues: { ':pk': `CATEGORY#${existing.slug}` },
      Limit: 1,
    }))
    if (inUse.Items?.length) {
      return error(`"${existing.name}" still has posts in it — move or delete them first`, 409)
    }

    await docClient.send(new DeleteCommand({ TableName: CATEGORIES_TABLE, Key: { id: existing.id } }))
    return noContent()
  } catch (err) {
    console.error('deleteCategory:', err)
    return serverError('Could not delete the category')
  }
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const method = event.httpMethod
  const hasSlug = Boolean(event.pathParameters?.slug)

  try {
    switch (method) {
      case 'GET': return listCategories()
      case 'POST': return createCategory(event)
      case 'PUT': case 'PATCH': return hasSlug ? updateCategory(event) : error('Slug is required', 400)
      case 'DELETE': return hasSlug ? deleteCategory(event) : error('Slug is required', 400)
      case 'OPTIONS': return success({})
      default: return error('Method not allowed', 405)
    }
  } catch (err) {
    console.error('Unhandled error:', err)
    return serverError('An unexpected error occurred')
  }
}
