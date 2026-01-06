import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { success, error, validationError, serverError } from '../shared/response'
import { generateId, isAdmin } from '../shared/utils'
import { UploadUrlRequest, UploadUrlResponse } from '../shared/types'

const s3Client = new S3Client({})
const MEDIA_BUCKET = process.env.MEDIA_BUCKET!
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN!

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'application/pdf']

export async function getUploadUrl(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!isAdmin(event)) return error('Admin access required', 403)

    const body: UploadUrlRequest = JSON.parse(event.body || '{}')
    if (!body.fileName || !body.contentType) return validationError('fileName and contentType are required')
    if (!ALLOWED_CONTENT_TYPES.includes(body.contentType)) return validationError('Invalid content type', { allowed: ALLOWED_CONTENT_TYPES })

    const folder = body.folder || 'uploads'
    const extension = body.fileName.split('.').pop() || ''
    const key = `${folder}/${generateId()}.${extension}`

    const command = new PutObjectCommand({
      Bucket: MEDIA_BUCKET, Key: key, ContentType: body.contentType,
      Metadata: { 'original-name': body.fileName, 'uploaded-at': new Date().toISOString() },
    })

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })
    const response: UploadUrlResponse = { uploadUrl, key, publicUrl: `https://${CLOUDFRONT_DOMAIN}/${key}` }
    return success(response)
  } catch (err) {
    console.error('Error generating upload URL:', err)
    return serverError('Failed to generate upload URL')
  }
}

export async function deleteMedia(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (!isAdmin(event)) return error('Admin access required', 403)
    const key = event.pathParameters?.key
    if (!key) return validationError('Media key is required')

    await s3Client.send(new DeleteObjectCommand({ Bucket: MEDIA_BUCKET, Key: decodeURIComponent(key) }))
    return success({ message: 'Media deleted successfully' })
  } catch (err) {
    console.error('Error deleting media:', err)
    return serverError('Failed to delete media')
  }
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log('Media Event:', JSON.stringify(event, null, 2))
  const method = event.httpMethod
  const path = event.path

  try {
    switch (method) {
      case 'POST': return path.includes('/upload') ? getUploadUrl(event) : error('Invalid endpoint', 404)
      case 'DELETE': return deleteMedia(event)
      case 'OPTIONS': return success({})
      default: return error('Method not allowed', 405)
    }
  } catch (err) {
    console.error('Unhandled error:', err)
    return serverError('An unexpected error occurred')
  }
}
