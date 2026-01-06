import { ApiResponse } from './types'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json',
}

export function success<T>(data: T, statusCode = 200): ApiResponse<T> {
  return { statusCode, headers: corsHeaders, body: JSON.stringify({ success: true, data }) }
}

export function created<T>(data: T): ApiResponse<T> {
  return success(data, 201)
}

export function noContent(): ApiResponse {
  return { statusCode: 204, headers: corsHeaders, body: '' }
}

export function error(message: string, statusCode = 400, details?: any): ApiResponse {
  return { statusCode, headers: corsHeaders, body: JSON.stringify({ success: false, error: { message, details } }) }
}

export function notFound(resource = 'Resource'): ApiResponse {
  return error(`${resource} not found`, 404)
}

export function unauthorized(message = 'Unauthorized'): ApiResponse {
  return error(message, 401)
}

export function forbidden(message = 'Forbidden'): ApiResponse {
  return error(message, 403)
}

export function serverError(message = 'Internal server error'): ApiResponse {
  return error(message, 500)
}

export function validationError(message: string, details?: any): ApiResponse {
  return error(message, 422, details)
}
