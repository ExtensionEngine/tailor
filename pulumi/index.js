'use strict';

const aws = require('@pulumi/aws');

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket('tailor');

// Create new IAM user
const user = new aws.iam.User('tailor-user', {
  name: 'tailor'
});
// Create access and secret keys for the user
const userCredentials = new aws.iam.AccessKey('tailor-user-key', {
  user: user.name
});

const policy = new aws.iam.Policy('tailor-bucket-access', {
  description: 'Allow tailor user full control over the tailor S3 bucket',
  policy: {
    Version: '2012-10-17',
    Statement: [{
      Sid: 'AllowRetouchS3Management',
      Effect: 'Allow',
      Resource: bucket.arn.apply(arn => arn + '/*'),
      Action: 's3:*'
    }]
  }
});

// Attack policy to the user
// eslint-disable-next-line no-new
new aws.iam.UserPolicyAttachment('user-policy-attachment', {
  user: user.name,
  policyArn: policy.arn
});

// Create postgres db instance
const db = new aws.rds.Instance('postgresdb', {
  engine: 'postgres',
  instanceClass: 'db.t2.micro',
  allocatedStorage: 20,
  name: 'tailor',
  username: 'tailor',
  password: 'tailor123',
  skipFinalSnapshot: true
});

// Export the name of the bucket
exports.bucketName = bucket.id;
exports.accessKey = userCredentials.id;
exports.secretKey = userCredentials.secret;
exports.dbHost = db.endpoint;
exports.dbPort = db.port;
exports.dbVersion = db.engineVersion;
