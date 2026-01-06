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
