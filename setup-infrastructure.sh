#!/bin/bash

# JAKLabs Infrastructure Setup Script
# Run this from your jaklabs-website root folder

echo "🚀 Creating JAKLabs AWS Infrastructure..."

# Create directory structure
mkdir -p infrastructure/bin
mkdir -p infrastructure/lib
mkdir -p infrastructure/lambda/blogs
mkdir -p infrastructure/lambda/media
mkdir -p infrastructure/lambda/shared

# ============================================
# infrastructure/package.json
# ============================================
cat > infrastructure/package.json << 'EOF'
{
  "name": "jaklabs-infrastructure",
  "version": "1.0.0",
  "description": "AWS CDK infrastructure for JAKLabs website",
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "cdk": "cdk",
    "deploy": "cdk deploy --all",
    "destroy": "cdk destroy --all",
    "diff": "cdk diff",
    "synth": "cdk synth"
  },
  "dependencies": {
    "aws-cdk-lib": "^2.120.0",
    "constructs": "^10.3.0",
    "esbuild": "^0.19.0",
    "source-map-support": "^0.5.21"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "aws-cdk": "^2.120.0",
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0"
  }
}
EOF

# ============================================
# infrastructure/cdk.json
# ============================================
cat > infrastructure/cdk.json << 'EOF'
{
  "app": "npx ts-node --prefer-ts-exts bin/app.ts",
  "watch": {
    "include": ["**"],
    "exclude": [
      "README.md",
      "cdk*.json",
      "**/*.d.ts",
      "**/*.js",
      "tsconfig.json",
      "package*.json",
      "node_modules",
      "test"
    ]
  },
  "context": {
    "@aws-cdk/aws-lambda:recognizeLayerVersion": true,
    "@aws-cdk/core:checkSecretUsage": true,
    "@aws-cdk/core:target-partitions": ["aws", "aws-cn"],
    "domainName": "jaklabs.io",
    "environment": "production"
  }
}
EOF

# ============================================
# infrastructure/tsconfig.json
# ============================================
cat > infrastructure/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": false,
    "inlineSourceMap": true,
    "inlineSources": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization": false,
    "outDir": "./dist",
    "rootDir": ".",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["bin/**/*", "lib/**/*", "lambda/**/*"],
  "exclude": ["node_modules", "cdk.out"]
}
EOF

# ============================================
# infrastructure/bin/app.ts
# ============================================
cat > infrastructure/bin/app.ts << 'EOF'
#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { DatabaseStack } from '../lib/database-stack'
import { StorageStack } from '../lib/storage-stack'
import { AuthStack } from '../lib/auth-stack'
import { ApiStack } from '../lib/api-stack'

const app = new cdk.App()

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
}

// Database Stack - DynamoDB tables
const databaseStack = new DatabaseStack(app, 'JakLabsDatabaseStack', {
  env,
  description: 'JAKLabs DynamoDB tables for blogs and CRM',
})

// Storage Stack - S3 buckets for media
const storageStack = new StorageStack(app, 'JakLabsStorageStack', {
  env,
  description: 'JAKLabs S3 storage for blog images and media',
})

// Auth Stack - Cognito for admin authentication
const authStack = new AuthStack(app, 'JakLabsAuthStack', {
  env,
  description: 'JAKLabs Cognito authentication for admin dashboard',
})

// API Stack - Lambda functions and API Gateway
const apiStack = new ApiStack(app, 'JakLabsApiStack', {
  env,
  description: 'JAKLabs API Gateway and Lambda functions',
  blogsTable: databaseStack.blogsTable,
  categoriesTable: databaseStack.categoriesTable,
  mediaBucket: storageStack.mediaBucket,
  userPool: authStack.userPool,
  userPoolClient: authStack.userPoolClient,
})

// Add dependencies
apiStack.addDependency(databaseStack)
apiStack.addDependency(storageStack)
apiStack.addDependency(authStack)

// Tags for all resources
cdk.Tags.of(app).add('Project', 'JAKLabs')
cdk.Tags.of(app).add('Environment', 'Production')
EOF

# ============================================
# infrastructure/lib/database-stack.ts
# ============================================
cat > infrastructure/lib/database-stack.ts << 'EOF'
import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

export class DatabaseStack extends cdk.Stack {
  public readonly blogsTable: dynamodb.Table
  public readonly categoriesTable: dynamodb.Table

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // BLOGS TABLE
    this.blogsTable = new dynamodb.Table(this, 'BlogsTable', {
      tableName: 'jaklabs-blogs',
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    })

    // GSI1: Query by status sorted by date
    this.blogsTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    })

    // GSI2: Query by category sorted by date
    this.blogsTable.addGlobalSecondaryIndex({
      indexName: 'GSI2',
      partitionKey: { name: 'GSI2PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI2SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    })

    // GSI3: Query by slug
    this.blogsTable.addGlobalSecondaryIndex({
      indexName: 'GSI3-Slug',
      partitionKey: { name: 'slug', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    })

    // CATEGORIES TABLE
    this.categoriesTable = new dynamodb.Table(this, 'CategoriesTable', {
      tableName: 'jaklabs-categories',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    this.categoriesTable.addGlobalSecondaryIndex({
      indexName: 'SlugIndex',
      partitionKey: { name: 'slug', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    })

    // OUTPUTS
    new cdk.CfnOutput(this, 'BlogsTableName', {
      value: this.blogsTable.tableName,
      exportName: 'JakLabs-BlogsTableName',
    })
    new cdk.CfnOutput(this, 'BlogsTableArn', {
      value: this.blogsTable.tableArn,
      exportName: 'JakLabs-BlogsTableArn',
    })
    new cdk.CfnOutput(this, 'CategoriesTableName', {
      value: this.categoriesTable.tableName,
      exportName: 'JakLabs-CategoriesTableName',
    })
  }
}
EOF

# ============================================
# infrastructure/lib/storage-stack.ts
# ============================================
cat > infrastructure/lib/storage-stack.ts << 'EOF'
import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import { Construct } from 'constructs'

export class StorageStack extends cdk.Stack {
  public readonly mediaBucket: s3.Bucket
  public readonly distribution: cloudfront.Distribution

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // S3 BUCKET FOR MEDIA
    this.mediaBucket = new s3.Bucket(this, 'MediaBucket', {
      bucketName: `jaklabs-media-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      lifecycleRules: [
        {
          id: 'DeleteOldVersions',
          noncurrentVersionExpiration: cdk.Duration.days(30),
          enabled: true,
        },
        {
          id: 'AbortIncompleteMultipartUploads',
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(7),
          enabled: true,
        },
      ],
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.DELETE, s3.HttpMethods.HEAD],
          allowedOrigins: ['http://localhost:3000', 'https://jaklabs.io', 'https://www.jaklabs.io', 'https://*.amplifyapp.com'],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag'],
          maxAge: 3000,
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    // CLOUDFRONT
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'MediaOAI', {
      comment: 'OAI for JAKLabs media bucket',
    })
    this.mediaBucket.grantRead(originAccessIdentity)

    this.distribution = new cloudfront.Distribution(this, 'MediaDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(this.mediaBucket, { originAccessIdentity }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      comment: 'JAKLabs Media CDN',
    })

    // OUTPUTS
    new cdk.CfnOutput(this, 'MediaBucketName', {
      value: this.mediaBucket.bucketName,
      exportName: 'JakLabs-MediaBucketName',
    })
    new cdk.CfnOutput(this, 'CloudFrontDomain', {
      value: this.distribution.distributionDomainName,
      exportName: 'JakLabs-CloudFrontDomain',
    })
    new cdk.CfnOutput(this, 'CloudFrontDistributionId', {
      value: this.distribution.distributionId,
      exportName: 'JakLabs-CloudFrontDistributionId',
    })
  }
}
EOF

# ============================================
# infrastructure/lib/auth-stack.ts
# ============================================
cat > infrastructure/lib/auth-stack.ts << 'EOF'
import * as cdk from 'aws-cdk-lib'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'

export class AuthStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool
  public readonly userPoolClient: cognito.UserPoolClient

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // COGNITO USER POOL
    this.userPool = new cognito.UserPool(this, 'JakLabsUserPool', {
      userPoolName: 'jaklabs-users',
      signInAliases: { email: true, username: false },
      selfSignUpEnabled: false,
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: cdk.Duration.days(7),
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      email: cognito.UserPoolEmail.withCognito(),
      standardAttributes: {
        email: { required: true, mutable: true },
        fullname: { required: true, mutable: true },
      },
      customAttributes: {
        role: new cognito.StringAttribute({ mutable: true }),
        company: new cognito.StringAttribute({ mutable: true }),
      },
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: { sms: false, otp: true },
      advancedSecurityMode: cognito.AdvancedSecurityMode.ENFORCED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    // USER POOL CLIENT
    this.userPoolClient = new cognito.UserPoolClient(this, 'JakLabsWebClient', {
      userPool: this.userPool,
      userPoolClientName: 'jaklabs-web-client',
      authFlows: { userSrp: true, userPassword: false, custom: true },
      accessTokenValidity: cdk.Duration.hours(1),
      idTokenValidity: cdk.Duration.hours(1),
      refreshTokenValidity: cdk.Duration.days(30),
      preventUserExistenceErrors: true,
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID, cognito.OAuthScope.PROFILE],
        callbackUrls: ['http://localhost:3000/api/auth/callback', 'https://jaklabs.io/api/auth/callback'],
        logoutUrls: ['http://localhost:3000', 'https://jaklabs.io'],
      },
      enableTokenRevocation: true,
      generateSecret: false,
    })

    // ADMIN GROUP
    new cognito.CfnUserPoolGroup(this, 'AdminGroup', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'Admins',
      description: 'Administrator group with full CMS access',
      precedence: 0,
    })

    new cognito.CfnUserPoolGroup(this, 'EditorGroup', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'Editors',
      description: 'Editor group with blog management access',
      precedence: 1,
    })

    // USER POOL DOMAIN
    const domain = this.userPool.addDomain('JakLabsDomain', {
      cognitoDomain: { domainPrefix: 'jaklabs-auth' },
    })

    // OUTPUTS
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      exportName: 'JakLabs-UserPoolId',
    })
    new cdk.CfnOutput(this, 'UserPoolArn', {
      value: this.userPool.userPoolArn,
      exportName: 'JakLabs-UserPoolArn',
    })
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      exportName: 'JakLabs-UserPoolClientId',
    })
    new cdk.CfnOutput(this, 'UserPoolDomain', {
      value: domain.domainName,
      exportName: 'JakLabs-UserPoolDomain',
    })
  }
}
EOF

# ============================================
# infrastructure/lib/api-stack.ts
# ============================================
cat > infrastructure/lib/api-stack.ts << 'EOF'
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as logs from 'aws-cdk-lib/aws-logs'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'

interface ApiStackProps extends cdk.StackProps {
  blogsTable: dynamodb.Table
  categoriesTable: dynamodb.Table
  mediaBucket: s3.Bucket
  userPool: cognito.UserPool
  userPoolClient: cognito.UserPoolClient
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const { blogsTable, categoriesTable, mediaBucket, userPool } = props

    const lambdaConfig = {
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      tracing: lambda.Tracing.ACTIVE,
      logRetention: logs.RetentionDays.ONE_MONTH,
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ['@aws-sdk/*'],
      },
    }

    // BLOGS LAMBDA
    const blogsLambda = new NodejsFunction(this, 'BlogsFunction', {
      ...lambdaConfig,
      functionName: 'jaklabs-blogs',
      entry: path.join(__dirname, '../lambda/blogs/handler.ts'),
      handler: 'handler',
      environment: {
        BLOGS_TABLE: blogsTable.tableName,
        MEDIA_BUCKET: mediaBucket.bucketName,
        CLOUDFRONT_DOMAIN: cdk.Fn.importValue('JakLabs-CloudFrontDomain'),
        NODE_OPTIONS: '--enable-source-maps',
      },
    })

    // MEDIA LAMBDA
    const mediaLambda = new NodejsFunction(this, 'MediaFunction', {
      ...lambdaConfig,
      functionName: 'jaklabs-media',
      entry: path.join(__dirname, '../lambda/media/handler.ts'),
      handler: 'handler',
      environment: {
        MEDIA_BUCKET: mediaBucket.bucketName,
        CLOUDFRONT_DOMAIN: cdk.Fn.importValue('JakLabs-CloudFrontDomain'),
        NODE_OPTIONS: '--enable-source-maps',
      },
    })

    // PERMISSIONS
    blogsTable.grantReadWriteData(blogsLambda)
    categoriesTable.grantReadWriteData(blogsLambda)
    mediaBucket.grantReadWrite(mediaLambda)
    mediaBucket.grantPut(blogsLambda)

    // API GATEWAY
    this.api = new apigateway.RestApi(this, 'JakLabsApi', {
      restApiName: 'jaklabs-api',
      description: 'JAKLabs Blog CMS API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key', 'X-Amz-Security-Token'],
        allowCredentials: true,
      },
      deployOptions: {
        stageName: 'v1',
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        metricsEnabled: true,
      },
    })

    // AUTHORIZER
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'BlogsAuthorizer', {
      authorizerName: 'jaklabs-authorizer',
      cognitoUserPools: [userPool],
    })

    const blogsIntegration = new apigateway.LambdaIntegration(blogsLambda)
    const mediaIntegration = new apigateway.LambdaIntegration(mediaLambda)

    const authOptions: apigateway.MethodOptions = {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    }

    // BLOG ROUTES
    const blogsResource = this.api.root.addResource('blogs')
    const blogResource = blogsResource.addResource('{slug}')

    blogsResource.addMethod('GET', blogsIntegration)
    blogResource.addMethod('GET', blogsIntegration)
    blogsResource.addMethod('POST', blogsIntegration, authOptions)
    blogResource.addMethod('PUT', blogsIntegration, authOptions)
    blogResource.addMethod('DELETE', blogsIntegration, authOptions)

    // MEDIA ROUTES
    const mediaResource = this.api.root.addResource('media')
    const uploadResource = mediaResource.addResource('upload')
    const mediaKeyResource = mediaResource.addResource('{key}')

    uploadResource.addMethod('POST', mediaIntegration, authOptions)
    mediaKeyResource.addMethod('DELETE', mediaIntegration, authOptions)

    // OUTPUTS
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      exportName: 'JakLabs-ApiUrl',
    })
  }
}
EOF

# ============================================
# infrastructure/lambda/package.json
# ============================================
cat > infrastructure/lambda/package.json << 'EOF'
{
  "name": "jaklabs-lambda-functions",
  "version": "1.0.0",
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.490.0",
    "@aws-sdk/client-s3": "^3.490.0",
    "@aws-sdk/lib-dynamodb": "^3.490.0",
    "@aws-sdk/s3-request-presigner": "^3.490.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/aws-lambda": "^8.10.131",
    "@types/uuid": "^9.0.0",
    "typescript": "^5.3.0"
  }
}
EOF

# ============================================
# infrastructure/lambda/shared/types.ts
# ============================================
cat > infrastructure/lambda/shared/types.ts << 'EOF'
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  authorId: string
  authorName: string
  readingTime: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
  PK: string
  SK: string
  GSI1PK?: string
  GSI1SK?: string
  GSI2PK?: string
  GSI2SK?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBlogInput {
  title: string
  excerpt: string
  content: string
  coverImage?: string
  category: string
  tags?: string[]
  status?: 'draft' | 'published'
}

export interface UpdateBlogInput {
  title?: string
  excerpt?: string
  content?: string
  coverImage?: string
  category?: string
  tags?: string[]
  status?: 'draft' | 'published'
}

export interface ApiResponse<T = any> {
  statusCode: number
  headers: Record<string, string>
  body: string
}

export interface PaginatedResponse<T> {
  items: T[]
  nextToken?: string
  count: number
}

export interface UploadUrlRequest {
  fileName: string
  contentType: string
  folder?: string
}

export interface UploadUrlResponse {
  uploadUrl: string
  key: string
  publicUrl: string
}
EOF

# ============================================
# infrastructure/lambda/shared/response.ts
# ============================================
cat > infrastructure/lambda/shared/response.ts << 'EOF'
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
EOF

# ============================================
# infrastructure/lambda/shared/utils.ts
# ============================================
cat > infrastructure/lambda/shared/utils.ts << 'EOF'
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
EOF

# ============================================
# infrastructure/lambda/blogs/handler.ts
# ============================================
cat > infrastructure/lambda/blogs/handler.ts << 'EOF'
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
EOF

# ============================================
# infrastructure/lambda/media/handler.ts
# ============================================
cat > infrastructure/lambda/media/handler.ts << 'EOF'
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
EOF

# ============================================
# Update .gitignore
# ============================================
cat >> .gitignore << 'EOF'

# AWS CDK
infrastructure/cdk.out/
infrastructure/node_modules/
infrastructure/lambda/node_modules/
infrastructure/dist/
*.js
*.d.ts
EOF

echo ""
echo "✅ Infrastructure files created successfully!"
echo ""
echo "📁 Created structure:"
echo "   infrastructure/"
echo "   ├── bin/app.ts"
echo "   ├── lib/"
echo "   │   ├── database-stack.ts"
echo "   │   ├── storage-stack.ts"
echo "   │   ├── auth-stack.ts"
echo "   │   └── api-stack.ts"
echo "   ├── lambda/"
echo "   │   ├── blogs/handler.ts"
echo "   │   ├── media/handler.ts"
echo "   │   └── shared/"
echo "   ├── package.json"
echo "   ├── tsconfig.json"
echo "   └── cdk.json"
echo ""
echo "🚀 Next steps:"
echo "   1. cd infrastructure"
echo "   2. npm install"
echo "   3. cdk bootstrap aws://ACCOUNT_ID/us-east-1"
echo "   4. npm run deploy"
echo ""
