/**
 * Tests for GET /admin/blogs/{slug} — written from the incident, not for coverage.
 *
 * The incident: the CRM's blog editor fetched a post through the PUBLIC
 * GET /blogs/{slug}. That route is mounted with authorization NONE, so API
 * Gateway never runs the authorizer, requestContext.authorizer is undefined, and
 * isAdmin() is structurally false — for everybody, including the owner. getBlog
 * ends with
 *
 *     if (!isAdmin(event) && blog.status !== 'published') return notFound()
 *
 * so every DRAFT returned 404 and the editor could not open one. Publish lives on
 * that page, so nothing could be published from it. Two posts sat unpublished for
 * days and the symptom read as "post not found" rather than "wrong route".
 *
 * It is the second half of a fix already applied to the LISTING: listBlogsForAdmin
 * exists for exactly this reason, and the single-post route never got it. A fix
 * applied to one of two copies of a bug is half a fix.
 *
 *   npx ts-node --transpile-only test/admin-get-blog.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { isAdmin } from '../lambda/shared/utils'

/** A request to a PUBLIC route, as API Gateway delivers it: no authorizer at all. */
const publicEvent = (slug: string) => ({
  pathParameters: { slug },
  resource: '/blogs/{slug}',
  path: `/blogs/${slug}`,
  httpMethod: 'GET',
  requestContext: {},
}) as any

/** The same person on the AUTHENTICATED route: claims are present. */
const adminEvent = (slug: string) => ({
  pathParameters: { slug },
  resource: '/admin/blogs/{slug}',
  path: `/admin/blogs/${slug}`,
  httpMethod: 'GET',
  // ⚠️ `cognito:groups` is load-bearing — isAdmin() checks GROUP MEMBERSHIP, not
  // merely the presence of claims. The first draft of this test omitted it and
  // failed, which is the fixture catching my own wrong assumption before the
  // assertion could enshrine it.
  requestContext: {
    authorizer: { claims: { email: 'owner@example.com', sub: 'abc', 'cognito:groups': 'Admins' } },
  },
}) as any

test('THE INCIDENT: isAdmin() is false on the public route even for the owner', () => {
  // This is the whole bug in one line. It is not a permissions mistake that could
  // be granted away — the authorizer never runs, so there are no claims to read.
  assert.equal(isAdmin(publicEvent('any-draft')), false)
})

test('isAdmin() is true on the authenticated admin route', () => {
  // The control. Without this the test above would also pass against a build
  // where isAdmin() simply always returned false.
  assert.equal(isAdmin(adminEvent('any-draft')), true)
})

test('the GET router sends an admin request WITH a slug to the single-post handler', () => {
  // Mirrors the dispatch in handler.ts. Before the fix this read
  //   if (isAdminRoute) return listBlogsForAdmin(event)
  // with no hasSlug check, so an admin GET carrying a slug returned a LIST —
  // a wrong answer shaped like a right one.
  const route = (e: any) => {
    const isAdminRoute = (e.resource || e.path || '').startsWith('/admin/')
    const hasSlug = e.pathParameters?.slug
    if (isAdminRoute) return hasSlug ? 'getBlogForAdmin' : 'listBlogsForAdmin'
    return hasSlug ? 'getBlog' : 'listBlogs'
  }
  assert.equal(route(adminEvent('a-post')), 'getBlogForAdmin')
  assert.equal(route({ ...adminEvent('x'), pathParameters: {} }), 'listBlogsForAdmin')
  assert.equal(route(publicEvent('a-post')), 'getBlog')
  assert.equal(route({ ...publicEvent('x'), pathParameters: {}, resource: '/blogs' }), 'listBlogs')
})

test('the admin route is declared in the CDK stack, behind the authorizer', () => {
  // The handler and the client can both be right and the post still 404 if the
  // route was never mounted. Read the stack source rather than trusting it.
  const src = require('node:fs').readFileSync(
    require('node:path').join(__dirname, '..', 'lib', 'api-stack.ts'), 'utf8')
  assert.match(src, /adminBlogsResource\.addResource\('\{slug\}'\)\.addMethod\('GET', blogsIntegration, authOptions\)/,
    'GET /admin/blogs/{slug} must exist AND carry authOptions — without the authorizer it is '
    + 'just the public route again under a longer name')
})
