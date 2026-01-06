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
