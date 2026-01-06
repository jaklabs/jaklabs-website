import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { success, created, noContent, error, notFound, validationError, serverError } from '../shared/response'
import { generateId, generateSlug, calculateReadingTime, getCurrentTimestamp, formatDateKey, getUserFromEvent, isAdmin, validateRequired, sanitizeHtml } from '../shared/utils'
import { BlogPost, CreateBlogInput, UpdateBlogInput, PaginatedResponse } from '../shared/types'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client, { marshallOptions: { removeUndefinedValues: true } })
const BLOGS_TABLE = process.env.BLOGS_TABLE!

export async function createBlog(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!isAdmin(event)) return error('Admin access required', 403)
    const user = getUserFromEvent(event)
    if (!user) return error('User not found', 401)

    const body: CreateBlogInput = JSON.parse(event.body || '{}')
    const validation = validateRequired(body, ['title', 'content', 'category'])
    if (!validation.valid) return validationError('Missing required fields', { missing: validation.missing })

    const now = getCurrentTimestamp()
    const id = generateId()
    const slug = generateSlug(body.title)
    const status = body.status || 'draft'
    const publishedAt = status === 'published' ? now : undefined

    const blog: BlogPost = {
      id, slug, title: body.title, excerpt: body.excerpt || body.content.substring(0, 200) + '...',
      content: sanitizeHtml(body.content), coverImage: body.coverImage || '', category: body.category,
      tags: body.tags || [], status, authorId: user.userId, authorName: user.email.split('@')[0],
      readingTime: calculateReadingTime(body.content), publishedAt, createdAt: now, updatedAt: now,
      PK: `BLOG#${id}`, SK: 'METADATA', GSI1PK: `STATUS#${status}`, GSI1SK: formatDateKey(publishedAt || now),
      GSI2PK: `CATEGORY#${body.category.toLowerCase()}`, GSI2SK: formatDateKey(publishedAt || now),
    }

    await docClient.send(new PutCommand({ TableName: BLOGS_TABLE, Item: blog, ConditionExpression: 'attribute_not_exists(PK)' }))
    return created(blog)
  } catch (err: any) {
    console.error('Error creating blog:', err)
    if (err.name === 'ConditionalCheckFailedException') return error('Blog already exists', 409)
    return serverError('Failed to create blog')
  }
}

export async function getBlog(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const slug = event.pathParameters?.slug
    if (!slug) return validationError('Slug is required')

    const result = await docClient.send(new QueryCommand({
      TableName: BLOGS_TABLE, IndexName: 'GSI3-Slug',
      KeyConditionExpression: 'slug = :slug', ExpressionAttributeValues: { ':slug': slug }, Limit: 1,
    }))

    if (!result.Items || result.Items.length === 0) return notFound('Blog post')
    const blog = result.Items[0] as BlogPost
    if (!isAdmin(event) && blog.status !== 'published') return notFound('Blog post')
    return success(blog)
  } catch (err) {
    console.error('Error getting blog:', err)
    return serverError('Failed to get blog')
  }
}

export async function listBlogs(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const queryParams = event.queryStringParameters || {}
    const status = queryParams.status || 'published'
    const category = queryParams.category
    const limit = Math.min(parseInt(queryParams.limit || '10'), 50)
    const nextToken = queryParams.nextToken

    let queryCommand: QueryCommand
    if (category) {
      queryCommand = new QueryCommand({
        TableName: BLOGS_TABLE, IndexName: 'GSI2', KeyConditionExpression: 'GSI2PK = :pk',
        FilterExpression: '#status = :status', ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':pk': `CATEGORY#${category.toLowerCase()}`, ':status': isAdmin(event) ? status : 'published' },
        ScanIndexForward: false, Limit: limit,
        ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString()) : undefined,
      })
    } else {
      queryCommand = new QueryCommand({
        TableName: BLOGS_TABLE, IndexName: 'GSI1', KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: { ':pk': `STATUS#${isAdmin(event) ? status : 'published'}` },
        ScanIndexForward: false, Limit: limit,
        ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString()) : undefined,
      })
    }

    const result = await docClient.send(queryCommand)
    const response: PaginatedResponse<BlogPost> = {
      items: (result.Items || []) as BlogPost[], count: result.Items?.length || 0,
      nextToken: result.LastEvaluatedKey ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64') : undefined,
    }
    return success(response)
  } catch (err) {
    console.error('Error listing blogs:', err)
    return serverError('Failed to list blogs')
  }
}

export async function updateBlog(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!isAdmin(event)) return error('Admin access required', 403)
    const slug = event.pathParameters?.slug
    if (!slug) return validationError('Slug is required')

    const body: UpdateBlogInput = JSON.parse(event.body || '{}')
    const existingResult = await docClient.send(new QueryCommand({
      TableName: BLOGS_TABLE, IndexName: 'GSI3-Slug',
      KeyConditionExpression: 'slug = :slug', ExpressionAttributeValues: { ':slug': slug }, Limit: 1,
    }))

    if (!existingResult.Items || existingResult.Items.length === 0) return notFound('Blog post')
    const existing = existingResult.Items[0] as BlogPost
    const now = getCurrentTimestamp()

    const updates: string[] = ['#updatedAt = :updatedAt']
    const expressionNames: Record<string, string> = { '#updatedAt': 'updatedAt' }
    const expressionValues: Record<string, any> = { ':updatedAt': now }

    if (body.title !== undefined) { updates.push('#title = :title'); expressionNames['#title'] = 'title'; expressionValues[':title'] = body.title }
    if (body.excerpt !== undefined) { updates.push('excerpt = :excerpt'); expressionValues[':excerpt'] = body.excerpt }
    if (body.content !== undefined) { updates.push('content = :content, readingTime = :readingTime'); expressionValues[':content'] = sanitizeHtml(body.content); expressionValues[':readingTime'] = calculateReadingTime(body.content) }
    if (body.coverImage !== undefined) { updates.push('coverImage = :coverImage'); expressionValues[':coverImage'] = body.coverImage }
    if (body.category !== undefined) { updates.push('category = :category, GSI2PK = :gsi2pk'); expressionValues[':category'] = body.category; expressionValues[':gsi2pk'] = `CATEGORY#${body.category.toLowerCase()}` }
    if (body.tags !== undefined) { updates.push('tags = :tags'); expressionValues[':tags'] = body.tags }
    if (body.status !== undefined) {
      updates.push('#status = :status, GSI1PK = :gsi1pk'); expressionNames['#status'] = 'status'
      expressionValues[':status'] = body.status; expressionValues[':gsi1pk'] = `STATUS#${body.status}`
      if (body.status === 'published' && !existing.publishedAt) {
        updates.push('publishedAt = :publishedAt, GSI1SK = :gsi1sk, GSI2SK = :gsi2sk')
        expressionValues[':publishedAt'] = now; expressionValues[':gsi1sk'] = formatDateKey(now); expressionValues[':gsi2sk'] = formatDateKey(now)
      }
    }

    const result = await docClient.send(new UpdateCommand({
      TableName: BLOGS_TABLE, Key: { PK: existing.PK, SK: existing.SK },
      UpdateExpression: `SET ${updates.join(', ')}`,
      ExpressionAttributeNames: Object.keys(expressionNames).length > 0 ? expressionNames : undefined,
      ExpressionAttributeValues: expressionValues, ReturnValues: 'ALL_NEW',
    }))
    return success(result.Attributes)
  } catch (err) {
    console.error('Error updating blog:', err)
    return serverError('Failed to update blog')
  }
}

export async function deleteBlog(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!isAdmin(event)) return error('Admin access required', 403)
    const slug = event.pathParameters?.slug
    if (!slug) return validationError('Slug is required')

    const existingResult = await docClient.send(new QueryCommand({
      TableName: BLOGS_TABLE, IndexName: 'GSI3-Slug',
      KeyConditionExpression: 'slug = :slug', ExpressionAttributeValues: { ':slug': slug }, Limit: 1,
    }))

    if (!existingResult.Items || existingResult.Items.length === 0) return notFound('Blog post')
    const existing = existingResult.Items[0] as BlogPost

    await docClient.send(new DeleteCommand({ TableName: BLOGS_TABLE, Key: { PK: existing.PK, SK: existing.SK } }))
    return noContent()
  } catch (err) {
    console.error('Error deleting blog:', err)
    return serverError('Failed to delete blog')
  }
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2))
  const method = event.httpMethod
  const hasSlug = event.pathParameters?.slug

  try {
    switch (method) {
      case 'GET': return hasSlug ? getBlog(event) : listBlogs(event)
      case 'POST': return createBlog(event)
      case 'PUT': case 'PATCH': return updateBlog(event)
      case 'DELETE': return deleteBlog(event)
      case 'OPTIONS': return success({})
      default: return error('Method not allowed', 405)
    }
  } catch (err) {
    console.error('Unhandled error:', err)
    return serverError('An unexpected error occurred')
  }
}
