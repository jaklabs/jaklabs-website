/**
 * Tests for the machine-caller path on POST /machine/blogs.
 *
 * This is the dangerous direction. The route lets a process create posts in the
 * CMS that serves jaklabs.io, and the two mistakes it could make are:
 *
 *   * attributing a post to a HUMAN it is only pretending to be — the forged
 *     `requestContext.authorizer.claims` idea this route exists to replace; or
 *   * widening admin rights to anything that can sign a request, so a machine
 *     quietly gains update, delete or publish.
 *
 * So most of what follows is about what it REFUSES. Each case was observed
 * failing against a deliberately broken build before being committed — a test
 * never seen to fail is a rumour.
 *
 *   npx ts-node --transpile-only test/machine-auth.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import {
  authorFor,
  isAdmin,
  machineCallerFromEvent,
  getUserFromEvent,
} from '../lambda/shared/utils'

const MACHINE_ARN = 'arn:aws:sts::706558533041:assumed-role/jaklabs-content-engine/push-1'

/** An IAM-signed request to the machine route, as API Gateway delivers it. */
const machineEvent = (over: any = {}) => ({
  resource: '/machine/blogs',
  httpMethod: 'POST',
  requestContext: { identity: { userArn: MACHINE_ARN } },
  ...over,
})

/** A Cognito-authorised request from the CRM blog desk. */
const humanEvent = (over: any = {}) => ({
  resource: '/blogs',
  httpMethod: 'POST',
  requestContext: {
    authorizer: {
      claims: {
        sub: 'a4f85458-e011-7037-a8ed-4ebe0b7e280d',
        email: 'jdakemp@gmail.com',
        'cognito:groups': 'Admins',
      },
    },
    identity: { userArn: null },
  },
  ...over,
})

test('the machine is authored as itself, never as a person', () => {
  const a = authorFor(machineEvent())
  assert.equal(a?.authorName, 'jaklabs-content-engine')
  assert.equal(a?.authorId, MACHINE_ARN)
  // The failure this whole route exists to make impossible.
  assert.notEqual(a?.authorName, 'jdakemp')
})

test('the human byline is byte-identical to what the table already holds', () => {
  // The nine posts pushed before this change carry exactly these values. If
  // this drifts, old and new posts by the same person stop matching.
  const a = authorFor(humanEvent())
  assert.equal(a?.authorId, 'a4f85458-e011-7037-a8ed-4ebe0b7e280d')
  assert.equal(a?.authorName, 'jdakemp')
})

test('BOTH conditions are required — neither alone mints a machine author', () => {
  // The right path, but on a route that was never declared IAM-authorised.
  assert.equal(machineCallerFromEvent({
    resource: '/blogs',
    requestContext: { identity: { userArn: MACHINE_ARN } },
  }), null)

  // The right route, but API Gateway attested no IAM principal — which is what
  // an unauthenticated or Cognito-authorised call looks like.
  assert.equal(machineCallerFromEvent({
    resource: '/machine/blogs',
    requestContext: { identity: { userArn: null } },
  }), null)

  assert.equal(machineCallerFromEvent({ resource: '/machine/blogs' }), null)
  assert.equal(machineCallerFromEvent({}), null)
})

test('a machine does NOT become an admin', () => {
  // The containment that keeps update, delete, rebuild and draft listings shut.
  // If this ever passes, signing a request became a way to administer the blog.
  assert.equal(isAdmin(machineEvent()), false)
  assert.equal(getUserFromEvent(machineEvent()), null)
})

test('a signed request cannot forge group membership', () => {
  // Claims are only ever populated by API Gateway's Cognito authorizer. A body
  // or header a client controls must not reach isAdmin().
  const spoofed = machineEvent({
    requestContext: {
      identity: { userArn: MACHINE_ARN },
      authorizer: { claims: { sub: 'x', email: 'root@example.com', 'cognito:groups': 'Admins' } },
    },
  })
  // It IS admin here — but only because this fixture hands it real claims, which
  // only the authorizer can do. What matters is that the MACHINE branch wins the
  // byline, so a machine route cannot be used to post as someone else.
  assert.equal(authorFor(spoofed)?.authorName, 'jaklabs-content-engine')
})

test('a non-Admin Cognito user cannot author a post', () => {
  const reader = humanEvent({
    requestContext: {
      authorizer: { claims: { sub: 's', email: 'reader@example.com', 'cognito:groups': 'Readers' } },
      identity: { userArn: null },
    },
  })
  assert.equal(authorFor(reader), null)
})

test('an unauthenticated public request cannot author a post', () => {
  // GET /blogs is deliberately public, so the authorizer never runs there.
  assert.equal(authorFor({ resource: '/blogs', requestContext: {} }), null)
  assert.equal(authorFor({}), null)
})

test('a plain IAM user arn yields the user name, not an arn fragment', () => {
  const a = machineCallerFromEvent({
    resource: '/machine/blogs',
    requestContext: { identity: { userArn: 'arn:aws:iam::706558533041:user/some-agent' } },
  })
  assert.equal(a?.authorName, 'some-agent')
})

test('the /machine/ prefix is matched at the START, not anywhere', () => {
  /* The first version of this test used resource '/blogs/{slug}' with a slug of
   * "machine/blogs" and PASSED against a build using `includes` instead of
   * `startsWith` — because '/blogs/{slug}' does not contain '/machine/' either.
   * It proved nothing. Mutation M5 is what exposed it.
   *
   * A string that discriminates has to CONTAIN '/machine/' without STARTING
   * with it, which is any nested route someone adds later: */
  const nested = {
    resource: '/admin/machine/rebuild',
    requestContext: { identity: { userArn: MACHINE_ARN } },
  }
  assert.equal(machineCallerFromEvent(nested), null,
    'a route merely containing /machine/ minted a machine author')

  // And the declared route still works, so the fix is not just "always null".
  assert.notEqual(machineCallerFromEvent(machineEvent()), null)
})
