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
