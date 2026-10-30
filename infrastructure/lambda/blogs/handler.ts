import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { success, created, noContent, error, notFound, validationError, serverError } from '../shared/response'
import { generateId, generateSlug, calculateReadingTime, getCurrentTimestamp, formatDateKey, getUserFromEvent, isAdmin, authorFor, machineCallerFromEvent, validateRequired, sanitizeHtml, toPlainText, buildExcerpt } from '../shared/utils'
import { BlogPost, CreateBlogInput, UpdateBlogInput, PaginatedResponse } from '../shared/types'
import { AmplifyClient, StartJobCommand } from '@aws-sdk/client-amplify'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client, { marshallOptions: { removeUndefinedValues: true } })
const BLOGS_TABLE = process.env.BLOGS_TABLE!

const amplify = new AmplifyClient({})
const AMPLIFY_APP_ID = process.env.AMPLIFY_APP_ID
const AMPLIFY_BRANCH = process.env.AMPLIFY_BRANCH || 'main'

/**
 * Rebuild the marketing site.
 *
 * WHY THIS EXISTS AT ALL, given the site already has an ISR revalidate route.
 *
 * Because revalidation here is unreliable for pages that are ALREADY cached, and
 * every interesting bulk edit is exactly that case — attaching covers to nine
 * live posts, publishing a batch. jaklabs-website's own harness records the
 * failure: an edit sat stale well past `revalidate = 300`, and a transient API
 * error once got rendered as zero posts and cached, so /blog served "No articles
 * found" until it was rebuilt. A rebuild is the dependable path, so the admin UI
 * gets the dependable path.
 *
 * WHY IT IS SAFE TO EXPOSE
 *
 * It takes no input. There is nothing to inject: the app id and branch come from
 * the environment, not the request body, so the worst an authenticated admin can
 * do is rebuild the site they are already able to edit. It is admin-only behind
 * the Cognito authorizer, same as every write route.
 *
 * If AMPLIFY_APP_ID is unset it fails closed with a 503 that says so, rather
 * than returning 200 and leaving someone to wonder why nothing changed — the
 * same rule the site's revalidate route follows.
 */
export async function rebuildSite(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!isAdmin(event)) return error('Admin access required', 403)
    if (!AMPLIFY_APP_ID) {
      return error('Rebuild is not configured — AMPLIFY_APP_ID is unset', 503)
    }

    const res = await amplify.send(new StartJobCommand({
      appId: AMPLIFY_APP_ID,
      branchName: AMPLIFY_BRANCH,
      jobType: 'RELEASE',
    }))

    return success({
      jobId: res.jobSummary?.jobId,
      status: res.jobSummary?.status,
      branch: AMPLIFY_BRANCH,
    })
  } catch (err) {
    console.error('Error starting rebuild:', err)
    return serverError('Could not start the rebuild')
  }
}

export async function createBlog(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    // Two ways in, one definition of the byline. A person in the Admins group on
    // either Cognito pool, or an IAM-signed caller on a /machine/ route — see
    // authorFor(). The Cognito branch there is unchanged, so the existing posts'
    // authorId/authorName remain what they were.
    const machine = machineCallerFromEvent(event)
    if (!machine) {
      if (!isAdmin(event)) return error('Admin access required', 403)
      if (!getUserFromEvent(event)) return error('User not found', 401)
    }
    const author = authorFor(event)
    if (!author) return error('Admin access required', 403)

    const body: CreateBlogInput = JSON.parse(event.body || '{}')
    const validation = validateRequired(body, ['title', 'content', 'category'])
    if (!validation.valid) return validationError('Missing required fields', { missing: validation.missing })

    // ⚠️ A MACHINE MAY NOT PUBLISH. This is the engine/bot line that the whole
    // content-engine design rests on: a bot decides to publish, an engine hands
    // a person something to read. push.py has no publish path for the same
    // reason; this is that rule enforced server-side, where a future caller
    // cannot simply choose not to honour it.
    //
    // It REFUSES rather than silently coercing to draft, because a caller that
    // asked to publish has a bug or a misunderstanding, and quietly writing
    // something other than what it asked for is how that survives to do damage
    // somewhere else.
    if (machine && body.status && body.status !== 'draft') {
      return error('A machine caller may only create drafts. Publishing is a person\'s decision, '
        + 'made in the CRM after reading the post.', 403)
    }

    const now = getCurrentTimestamp()
    const id = generateId()
    // An explicit slug wins, normalised through the same function so a caller
    // cannot inject anything odd. Falls back to deriving from the title.
    //
    // Before this, body.slug was accepted by the type and silently discarded:
    // a client that set its own slug got a different one back and had no reason
    // to look. The slug is the permanent public URL — the author should decide
    // it, and a title edit must never move a page that has been linked to.
    const slug = generateSlug(body.slug || body.title)
    // Sanitise ONCE, up front, so everything derived from the body — the
    // excerpt, the reading time — is derived from what will actually be stored.
    const safeContent = sanitizeHtml(body.content)
    const status = body.status || 'draft'
    const publishedAt = status === 'published' ? now : undefined

    const blog: BlogPost = {
      id, slug, title: toPlainText(body.title), excerpt: buildExcerpt(body.excerpt, safeContent),
      content: safeContent, coverImage: body.coverImage || '', category: body.category,
      tags: body.tags || [], status, authorId: author.authorId, authorName: author.authorName,
      readingTime: calculateReadingTime(toPlainText(safeContent)), publishedAt, createdAt: now, updatedAt: now,
      PK: `BLOG#${id}`, SK: 'METADATA', GSI1PK: `STATUS#${status}`, GSI1SK: formatDateKey(publishedAt || now),
      GSI2PK: `CATEGORY#${body.category.toLowerCase()}`, GSI2SK: formatDateKey(publishedAt || now),
    }

    // ⚠️ THE SLUG UNIQUENESS CHECK IS NOT BELT-AND-BRACES. IT IS THE ONLY ONE.
    //
    // The ConditionExpression below reads like it prevents duplicates. It does
    // not: `id` is a fresh uuid on every call, so `attribute_not_exists(PK)` can
    // never fail, and nothing else anywhere checked that a slug was unused.
    // Posting the same slug twice therefore created TWO posts sharing one public
    // URL — and because getBlog queries GSI3-Slug with `Limit: 1`, the duplicate
    // was almost invisible through the API; you only found it by querying the
    // index directly.
    //
    // That mattered little while every write came from a human clicking Save. It
    // matters a great deal now a machine can retry: an interrupted batch re-run
    // is the ordinary case, not the exotic one.
    //
    // Checked as a query rather than a condition because the uniqueness lives on
    // a GSI, and a condition expression cannot reach one. The race between this
    // read and the write below is real and accepted: two simultaneous creates of
    // one slug remain possible. Writes here are a person saving a post or a
    // serial push loop, so the exposure is a retry, which this does catch.
    const clash = await docClient.send(new QueryCommand({
      TableName: BLOGS_TABLE, IndexName: 'GSI3-Slug',
      KeyConditionExpression: 'slug = :slug', ExpressionAttributeValues: { ':slug': slug }, Limit: 1,
    }))
    if (clash.Items && clash.Items.length > 0) {
      return error(`A post already exists at /blog/${slug}. Edit that one, or change the slug — `
        + 'creating a second would put two posts on one URL.', 409)
    }

    await docClient.send(new PutCommand({ TableName: BLOGS_TABLE, Item: blog, ConditionExpression: 'attribute_not_exists(PK)' }))
    return created(blog)
  } catch (err: any) {
    console.error('Error creating blog:', err)
    if (err.name === 'ConditionalCheckFailedException') return error('Blog already exists', 409)
    return serverError('Failed to create blog')
  }
}

async function findBySlug(slug: string): Promise<BlogPost | null> {
  const result = await docClient.send(new QueryCommand({
    TableName: BLOGS_TABLE, IndexName: 'GSI3-Slug',
    KeyConditionExpression: 'slug = :slug', ExpressionAttributeValues: { ':slug': slug }, Limit: 1,
  }))
  if (!result.Items || result.Items.length === 0) return null
  return result.Items[0] as BlogPost
}

/**
 * PUBLIC single post. Mounted with authorization NONE, so API Gateway never runs
 * the authorizer and `requestContext.authorizer` is always undefined here —
 * isAdmin() cannot be true on this route, for anybody, ever.
 *
 * A draft therefore 404s, which is correct for an anonymous reader: it must not
 * learn that an unpublished post exists. The isAdmin() call below is kept only
 * so the intent is readable; it is always false. Do NOT "fix" that by moving this
 * route behind the authorizer — the website fetches published posts
 * unauthenticated and that is the whole point of the route.
 *
 * The CRM must use getBlogForAdmin instead. See its comment.
 */
export async function getBlog(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const slug = event.pathParameters?.slug
    if (!slug) return validationError('Slug is required')

    const blog = await findBySlug(slug)
    if (!blog) return notFound('Blog post')
    if (!isAdmin(event) && blog.status !== 'published') return notFound('Blog post')
    return success(blog)
  } catch (err) {
    console.error('Error getting blog:', err)
    return serverError('Failed to get blog')
  }
}

/**
 * Authenticated single post, any status. The other half of a fix that was only
 * ever applied to the listing.
 *
 * listBlogsForAdmin exists because the admin UI called the PUBLIC list route and
 * silently received published posts when it asked for drafts. The identical fault
 * was left in place one route over: the CRM's editor loaded a post through the
 * public GET /blogs/{slug}, where isAdmin() is structurally false, so every DRAFT
 * came back 404 and the editor could not open it. Nobody could publish anything
 * from the edit page — two posts sat undone for days, and the failure looked like
 * a missing post rather than a missing permission.
 *
 * So this is the single-post twin of listBlogsForAdmin, and it behaves the same
 * way: authenticated, 403 if the caller is not an admin, never a quiet
 * substitution. The admin check is FIRST so an unauthorised caller cannot use
 * timing or a 404-vs-403 difference to probe which slugs exist.
 */
export async function getBlogForAdmin(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!isAdmin(event)) return error('Admin access required', 403)

    const slug = event.pathParameters?.slug
    if (!slug) return validationError('Slug is required')

    const blog = await findBySlug(slug)
    if (!blog) return notFound('Blog post')
    return success(blog)
  } catch (err) {
    console.error('Error getting blog for admin:', err)
    return serverError('Failed to get blog')
  }
}

/**
 * Listing for the CRM admin: any status, and it refuses rather than silently
 * degrading if the caller is not an admin.
 *
 * The public listBlogs below quietly rewrites status to 'published' when
 * isAdmin() is false. On the public route that is correct — an anonymous reader
 * asking for drafts should get published posts, not an error. But it meant the
 * admin UI, which calls the same public route, asked for drafts and received
 * published posts with a 200 and no indication anything had been substituted.
 * A wrong answer that looks like a right one.
 *
 * So this route does the opposite: authenticated, and 403 if you are not an
 * admin. Same underlying query, honest about failure.
 */
export async function listBlogsForAdmin(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!isAdmin(event)) return error('Admin access required', 403)

    const q = event.queryStringParameters || {}
    const status = q.status
    const limit = Math.min(parseInt(q.limit || '50'), 100)
    const nextToken = q.nextToken
      ? JSON.parse(Buffer.from(q.nextToken, 'base64').toString())
      : undefined

    // No status given means every status, which is what an admin index wants —
    // one list showing drafts and published together.
    const statuses = status ? [status] : ['draft', 'published']
    const pages = await Promise.all(statuses.map((s) => docClient.send(new QueryCommand({
      TableName: BLOGS_TABLE, IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: { ':pk': `STATUS#${s}` },
      ScanIndexForward: false, Limit: limit,
      ExclusiveStartKey: statuses.length === 1 ? nextToken : undefined,
    }))))

    const items = pages.flatMap((r) => (r.Items || []) as BlogPost[])
      .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))

    const response: PaginatedResponse<BlogPost> = {
      items, count: items.length,
      // Only meaningful for a single-status query; merging two cursors would be
      // a lie, so it is omitted rather than guessed.
      nextToken: statuses.length === 1 && pages[0].LastEvaluatedKey
        ? Buffer.from(JSON.stringify(pages[0].LastEvaluatedKey)).toString('base64')
        : undefined,
    }
    return success(response)
  } catch (err) {
    console.error('listBlogsForAdmin failed:', err)
    return serverError('Could not list posts')
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

/**
 * Tell the website a post's published state changed, so it drops the cached
 * blog index instead of serving a stale one.
 *
 * Amplify's SSR hosting keeps the ISR cache per Lambda instance with no shared
 * store, so time-based `revalidate` is unreliable — a published post sat
 * invisible on the index for over six minutes and only appeared after a full
 * rebuild. Rather than the site guessing when to refresh, the CMS tells it.
 *
 * Deliberately best-effort. If revalidation fails the post is still published
 * and correct in the database; the index is just stale until the next
 * regeneration. Failing the write because a cache hint did not land would be
 * strictly worse.
 */
async function revalidateSite(slug: string): Promise<void> {
  const url = process.env.SITE_REVALIDATE_URL
  const secret = process.env.REVALIDATE_SECRET
  if (!url || !secret) return

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ slug }),
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) console.warn(`Revalidate returned ${res.status} for ${slug}`)
  } catch (err) {
    console.warn(`Revalidate call failed for ${slug}:`, err)
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

    if (body.title !== undefined) { updates.push('#title = :title'); expressionNames['#title'] = 'title'; expressionValues[':title'] = toPlainText(body.title) }
    if (body.excerpt !== undefined) { updates.push('excerpt = :excerpt'); expressionValues[':excerpt'] = toPlainText(body.excerpt) }
    if (body.content !== undefined) {
      const safeContent = sanitizeHtml(body.content)
      updates.push('content = :content, readingTime = :readingTime')
      expressionValues[':content'] = safeContent
      expressionValues[':readingTime'] = calculateReadingTime(toPlainText(safeContent))
      // Rewriting the body with no new excerpt should refresh the auto-derived
      // one, or the index keeps summarising a draft nobody can read any more.
      if (body.excerpt === undefined) {
        updates.push('excerpt = :excerpt')
        expressionValues[':excerpt'] = buildExcerpt(undefined, safeContent)
      }
    }
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

    // Only when the published state actually changed. A title tweak on a draft
    // has no effect on what the site is serving, and revalidating on every edit
    // would drop the cache for nothing.
    const wasPublished = existing.status === 'published'
    const nowPublished = (result.Attributes?.status ?? existing.status) === 'published'
    if (wasPublished !== nowPublished || (nowPublished && body.content !== undefined)) {
      await revalidateSite(String(result.Attributes?.slug ?? slug))
    }

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
  // /admin/blogs runs behind the Cognito authorizer, so claims are present and
  // isAdmin() can be true. /blogs is public and never sees claims.
  const isAdminRoute = (event.resource || event.path || '').startsWith('/admin/')
  const isRebuildRoute = (event.resource || event.path || '').includes('/admin/rebuild')

  try {
    switch (method) {
      case 'GET':
        // ⚠️ hasSlug is checked on BOTH sides. Before /admin/blogs/{slug} existed
        // this read `if (isAdminRoute) return listBlogsForAdmin(event)`, so an
        // admin GET carrying a slug would have returned a LIST — a wrong answer
        // shaped like a right one, which is the same fault this whole pair of
        // routes exists to stop.
        if (isAdminRoute) return hasSlug ? getBlogForAdmin(event) : listBlogsForAdmin(event)
        return hasSlug ? getBlog(event) : listBlogs(event)
      case 'POST':
        if (isRebuildRoute) return rebuildSite(event)
        return createBlog(event)
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
