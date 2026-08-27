import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as logs from 'aws-cdk-lib/aws-logs'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'

interface ApiStackProps extends cdk.StackProps {
  blogsTable: dynamodb.Table
  categoriesTable: dynamodb.Table
  mediaBucket: s3.Bucket
  userPool: cognito.UserPool
  userPoolClient: cognito.UserPoolClient
  /** The CRM's Cognito pool, so its tokens are accepted for authoring. */
  crmUserPoolId: string
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

    // AUDIT LAMBDA
    //
    // Heavier than the others on purpose: it launches a real Chromium, because
    // the most common fault in the data — a JavaScript error on the homepage —
    // is invisible to anything that does not execute the page.
    //
    // 1536MB is not generosity; Chromium is slow below it and Lambda scales CPU
    // with memory, so a smaller setting costs MORE per request by running
    // longer. externalModules must NOT include the chromium package — its
    // binary has to be bundled or there is no browser to launch.
    const auditLambda = new NodejsFunction(this, 'AuditFunction', {
      functionName: 'jaklabs-audit',
      entry: path.join(__dirname, '../lambda/audit/handler.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(60),
      memorySize: 1536,
      tracing: lambda.Tracing.ACTIVE,
      logRetention: logs.RetentionDays.ONE_MONTH,
      // nodeModules are installed from a lockfile at bundle time, and CDK
      // defaults to the nearest one — which is this CDK package's, where
      // chromium is not a dependency and never should be. Point it at the
      // lambda workspace that actually declares them.
      depsLockFilePath: path.join(__dirname, '../lambda/package-lock.json'),
      bundling: {
        minify: true,
        sourceMap: true,
        // ESM, not the CommonJS default. @sparticuz/chromium v149 is an
        // ESM-only package, so a CJS bundle emits require() against it and the
        // function dies at init with ERR_REQUIRE_ESM before the handler is ever
        // reached — which surfaces as a bare "Internal server error".
        format: lambdaNodejs.OutputFormat.ESM,
        externalModules: ['@aws-sdk/*'],
        // Left OUT of the bundle and installed as real packages: chromium ships
        // a compressed binary that esbuild cannot inline, and puppeteer-core
        // resolves it from disk at runtime.
        nodeModules: ['@sparticuz/chromium', 'puppeteer-core'],
      },
      environment: { NODE_OPTIONS: '--enable-source-maps' },
    })

    // CATEGORIES LAMBDA
    //
    // Its own function rather than another branch inside the blogs handler: that
    // router dispatches on HTTP method alone, so POST /categories would have
    // landed in createBlog. Separating them keeps each router trivial.
    const categoriesLambda = new NodejsFunction(this, 'CategoriesFunction', {
      ...lambdaConfig,
      functionName: 'jaklabs-categories',
      entry: path.join(__dirname, '../lambda/categories/handler.ts'),
      handler: 'handler',
      environment: {
        CATEGORIES_TABLE: categoriesTable.tableName,
        // Read-only, and only to refuse deleting a category that still has
        // posts filed under it.
        BLOGS_TABLE: blogsTable.tableName,
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
    categoriesTable.grantReadWriteData(categoriesLambda)
    // Read-only on purpose — the categories handler must never edit a post.
    blogsTable.grantReadData(categoriesLambda)
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
    //
    // TWO pools, deliberately. `jaklabs-users` is this site's own pool; the
    // second is the CRM's (`jaklabs-crm-prod`), because the blog admin lives in
    // the CRM Jak already signs into every day rather than behind a second
    // login on the marketing site.
    //
    // One API Gateway authorizer can accept several pools, which is why the
    // alternative — reimplementing blog CRUD inside the CRM against the same
    // table — was not taken. Two codebases writing one table diverge; one API
    // trusting two issuers does not.
    //
    // Authorisation still comes from the `Admins` group claim, so a CRM user
    // who is not in that group can read published posts and nothing more.
    const crmUserPool = cognito.UserPool.fromUserPoolId(this, 'CrmUserPool', props.crmUserPoolId)

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'BlogsAuthorizer', {
      authorizerName: 'jaklabs-authorizer',
      cognitoUserPools: [userPool, crmUserPool],
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

    // CATEGORY ROUTES
    const categoriesIntegration = new apigateway.LambdaIntegration(categoriesLambda)
    const categoriesResource = this.api.root.addResource('categories')
    const categoryResource = categoriesResource.addResource('{slug}')

    // Reading is public: the website's category filter needs it unauthenticated.
    categoriesResource.addMethod('GET', categoriesIntegration)
    categoriesResource.addMethod('POST', categoriesIntegration, authOptions)
    categoryResource.addMethod('PUT', categoriesIntegration, authOptions)
    categoryResource.addMethod('DELETE', categoriesIntegration, authOptions)

    // AUDIT ROUTE — public and unauthenticated, which is the point of it.
    //
    // Throttled well below the API default. This launches a browser per call:
    // unthrottled it is both a way to run up a bill and a way to use jaklabs.io
    // as a traffic source against someone else's site.
    const auditResource = this.api.root.addResource('audit')
    auditResource.addMethod('POST', new apigateway.LambdaIntegration(auditLambda))

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
