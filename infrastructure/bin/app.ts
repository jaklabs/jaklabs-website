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
  // The CRM's pool, so the blog admin can live inside the CRM. Overridable for
  // a non-production deploy; there is exactly one CRM, so it is not a lookup.
  crmUserPoolId: process.env.CRM_USER_POOL_ID || 'us-east-1_UCehzgHPU',
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
