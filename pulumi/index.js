/* eslint-disable no-useless-escape */
'use strict';

// const { CopyFile, RemoteExec } = require('./provisioners');
const aws = require('@pulumi/aws');
// const { getFileHash } = require('./util');
const pulumi = require('@pulumi/pulumi');

const config = new pulumi.Config();

// Create an AWS resource (S3 Bucket)
// const bucket = new aws.s3.Bucket('tailor');

// // Create new IAM user
// const user = new aws.iam.User('tailor-user', {
//   name: 'tailor'
// });
// // Create access and secret keys for the user
// const userCredentials = new aws.iam.AccessKey('tailor-user-key', {
//   user: user.name
// });

// const policy = new aws.iam.Policy('tailor-bucket-access', {
//   description: 'Allow tailor user full control over the tailor S3 bucket',
//   policy: {
//     Version: '2012-10-17',
//     Statement: [{
//       Sid: 'AllowRetouchS3Management',
//       Effect: 'Allow',
//       Resource: bucket.arn.apply(arn => arn + '/*'),
//       Action: 's3:*'
//     }]
//   }
// });

// // Attach policy to the user
// // eslint-disable-next-line no-new
// new aws.iam.UserPolicyAttachment('user-policy-attachment', {
//   user: user.name,
//   policyArn: policy.arn
// });

// // Create postgres db instance
// const db = new aws.rds.Instance('postgresdb', {
//   engine: 'postgres',
//   instanceClass: 'db.t2.micro',
//   allocatedStorage: 20,
//   name: 'tailor', // db name
//   username: 'tailor',
//   password: 'tailor123',
//   skipFinalSnapshot: true
// });

const publicKey = config.get('publicKey');
// const privateKey = config.requireSecret('privateKey');
const myKey = new aws.ec2.KeyPair('mykey', { publicKey });

const secgrp = new aws.ec2.SecurityGroup('server-sec-grp', {
  ingress: [
    { protocol: 'tcp', fromPort: 22, toPort: 22, cidrBlocks: ['0.0.0.0/0'] },
    { protocol: 'tcp', fromPort: 80, toPort: 80, cidrBlocks: ['0.0.0.0/0'] },
    { protocol: 'tcp', fromPort: 3000, toPort: 3000, cidrBlocks: ['0.0.0.0/0'] },
    { protocol: 'tcp', fromPort: 443, toPort: 443, cidrBlocks: ['0.0.0.0/0'] }
  ],
  egress: [
    { protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] }
  ]
});

const server = new aws.ec2.Instance('server', {
  ami: 'ami-0885b1f6bd170450c',
  instanceType: 't2.micro',
  keyName: myKey.keyName,
  vpcSecurityGroupIds: [secgrp.id]
});

// const conn = {
//   host: server.publicIp,
//   username: 'ubuntu',
//   privateKey
//   // privateKeyPassphrase
// };

// const changeToken = getFileHash('node_install.sh');
// // Copy a config file to our server.
// const cpConfig = new CopyFile('copy-script', {
//   changeToken,
//   conn,
//   src: 'node_install.sh',
//   dest: './'
// }, { dependsOn: server });

// const chmodInstall = new RemoteExec('chmod-install', {
//   conn,
//   command: 'chmod 755 node_install.sh'
// }, { dependsOn: cpConfig });

// // Execute a basic command on our server.
// const catConfig = new RemoteExec('install-node', {
//   changeToken,
//   conn,
//   command: './node_install.sh'
// }, { dependsOn: chmodInstall });

// const eipStack = config.get('eipStack');
// const eipIp = new pulumi.StackReference(eipStack).getOutput('elasticIp');

// exports.bucketName = bucket.id;
// exports.accessKey = userCredentials.id;
// exports.secretKey = userCredentials.secret;
// exports.dbHost = db.address;
// exports.dbPort = db.port;
exports.serverPublicDns = server.publicDns;
exports.serverPublicIp = server.publicIp;
