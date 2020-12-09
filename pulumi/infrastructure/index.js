'use strict';

const { CopyFile, RemoteExec } = require('./provisioners');
const aws = require('@pulumi/aws');
const awsx = require('@pulumi/awsx');
const { getFileHash } = require('./util');
const pulumi = require('@pulumi/pulumi');

// Pulumi config object used to get pulumi configuration provided in the stack yaml
const config = new pulumi.Config();

// Create custom vpc
const vpc = new awsx.ec2.Vpc('tailor-test-vpc', {
  cidrBlock: '10.0.0.0/16',
  numberOfAvailabilityZones: 2,
  subnets: [{ type: 'public' }, { type: 'private' }]
});

// Create a security group to restrict access to the ec2 instance
const serverSecgrp = new aws.ec2.SecurityGroup('server-sec-grp', {
  ingress: [
    { protocol: 'tcp', fromPort: 22, toPort: 22, cidrBlocks: ['0.0.0.0/0'] },
    { protocol: 'tcp', fromPort: 80, toPort: 80, cidrBlocks: ['0.0.0.0/0'] },
    { protocol: 'tcp', fromPort: 443, toPort: 443, cidrBlocks: ['0.0.0.0/0'] }
  ],
  egress: [
    { protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] }
  ],
  vpcId: vpc.id
});
// Create a security group to restrict access to the postgres instance
const dbSecgrp = new aws.ec2.SecurityGroup('db-sec-grp', {
  ingress: [
    { protocol: 'tcp', fromPort: 5432, toPort: 5432, securityGroups: [serverSecgrp.id] }
  ],
  vpcId: vpc.id
}, { dependsOn: serverSecgrp });

// Create S3 Bucket
const bucket = new aws.s3.Bucket('tailor-test');

// Create IAM user with access to the S3 bucket
const user = new aws.iam.User('tailor-test-user', { name: 'tailor-test' });
const policy = new aws.iam.Policy('tailor-test-bucket-access', {
  description: 'Allow tailor user full control over the tailor S3 bucket',
  policy: {
    Version: '2012-10-17',
    Statement: [{
      Sid: 'AllowTailorTestS3Management',
      Effect: 'Allow',
      Resource: bucket.arn.apply(arn => arn + '/*'),
      Action: 's3:*'
    }]
  }
});
// eslint-disable-next-line no-new
new aws.iam.UserPolicyAttachment('user-policy-attachment', {
  user: user.name,
  policyArn: policy.arn
});

// Create access and secret keys for the user
const userCredentials = new aws.iam.AccessKey('tailor-test-user-keys', {
  user: user.name
});

const dbSubnetGroup = new aws.rds.SubnetGroup('db-subnet-group', {
  subnetIds: vpc.privateSubnetIds
});
// Create postgres db instance
const db = new aws.rds.Instance('tailor-test-postgres', {
  engine: 'postgres',
  instanceClass: 'db.t2.micro',
  allocatedStorage: 20,
  dbSubnetGroupName: dbSubnetGroup.name,
  name: config.get('dbName'), // db name
  username: config.get('dbUser'),
  password: config.getSecret('dbPassword'),
  skipFinalSnapshot: true,
  vpcSecurityGroupIds: [dbSecgrp.id]
});

const publicKey = config.get('publicKey');
// Create an ssh keypair used for ssh connection to the ec2 instance
const sshKeyPair = new aws.ec2.KeyPair('tailor-test-key', { publicKey });

// const userData =
// `#!/bin/bash
// cat > /etc/profile.d/load_env.sh << 'EOF'
// export DATABASE_NAME=${config.get('dbName')}
// export DATABASE_USER=${config.get('dbUser')}
// export DATABASE_PASSWORD=${config.getSecret('dbPassword').get()}
// export DATABASE_HOST=${db.address.get()}
// export DATABASE_PORT=${db.port.get()}
// export STORAGE_KEY=${userCredentials.id.get()}
// export STORAGE_SECRET=${userCredentials.secret.get()}
// export STORAGE_REGION=${bucket.region.get()}
// export STORAGE_BUCKET=${bucket.id.get()}
// EOF
// chmod a+x /etc/profile.d/load_env.sh
// `;

// Create ec2 instance
const server = new aws.ec2.Instance('server', {
  ami: 'ami-0885b1f6bd170450c',
  instanceType: 't2.medium',
  keyName: sshKeyPair.keyName,
  // This will create only one instance (in the first public subnet).
  // To create instances in all public subnets (if there are multiple availability zones)
  // use for loop to iterate over the public subnets.
  subnetId: vpc.publicSubnetIds.then(ids => ids[0]),
  vpcSecurityGroupIds: [serverSecgrp.id],
  // userData,
  tags: {
    name: 'pulumi-tailor-test'
  }
}, { dependsOn: [bucket, db] });

// Get the elastic IP address from the eip stack
const eipStack = new pulumi.StackReference(config.get('eipStackName'));
const eipId = eipStack.getOutput('id');

// Associate elastic IP address to the newly created ec2 instance.
// The elastic IP address is created separately (../eip folder)
// eslint-disable-next-line no-new
new aws.ec2.EipAssociation('tailor-eip-assoc', {
  instanceId: server.id,
  allocationId: eipId
});

// Install required software
const privateKey = config.getSecret('privateKey');
const privateKeyPassphrase = config.getSecret('privateKeyPassphrase');
const elasticIp = eipStack.getOutput('ip');
// ssh connection options
const conn = {
  host: elasticIp,
  username: 'ubuntu',
  privateKey,
  privateKeyPassphrase
};
// Install nginx
const nginxConfigFileHash = getFileHash('./scripts/ivo.extnsn.com');
const cpNginxConfig = new CopyFile('cp-nginx-config', {
  changeToken: nginxConfigFileHash,
  conn,
  src: './scripts/ivo.extnsn.com',
  dest: './'
}, { dependsOn: server });
const nginxInstallFileHash = getFileHash('./scripts/nginx_install.sh');
const cpNginx = new CopyFile('cp-nginx', {
  changeToken: nginxInstallFileHash,
  conn,
  src: './scripts/nginx_install.sh',
  dest: './'
}, { dependsOn: cpNginxConfig });
const chmodNginxInstall = new RemoteExec('chmod-nginx-install', {
  conn,
  command: 'chmod 755 ./nginx_install.sh'
}, { dependsOn: cpNginx });
const nginxInstall = new RemoteExec('install-nginx', {
  nginxInstallFileHash,
  conn,
  command: './nginx_install.sh'
}, { dependsOn: chmodNginxInstall });

// Install nodejs
const nodeInstallFileHash = getFileHash('./scripts/node_install.sh');
const cpNodejs = new CopyFile('cp-nodejs', {
  changeToken: nodeInstallFileHash,
  conn,
  src: './scripts/node_install.sh',
  dest: './'
}, { dependsOn: nginxInstall });
const chmodNodejsInstall = new RemoteExec('chmod-nodejs-install', {
  conn,
  command: 'chmod 755 ./node_install.sh'
}, { dependsOn: cpNodejs });
const nodejsInstall = new RemoteExec('install-node', {
  nodeInstallFileHash,
  conn,
  command: './node_install.sh'
}, { dependsOn: chmodNodejsInstall });

// Get ssl certificate
const certbotInstallFileHash = getFileHash('./scripts/certbot_install.sh');
const cpCertbot = new CopyFile('cp-certbot', {
  changeToken: certbotInstallFileHash,
  conn,
  src: './scripts/certbot_install.sh',
  dest: './'
}, { dependsOn: nodejsInstall });
const chmodCertbotInstall = new RemoteExec('chmod-certbot-install', {
  conn,
  command: 'chmod 755 ./certbot_install.sh'
}, { dependsOn: cpCertbot });
// eslint-disable-next-line no-unused-vars
const certbotInstall = new RemoteExec('install-certbot', {
  certbotInstallFileHash,
  conn,
  command: `CERT_EMAIL=${config.get('certificateEmail')} CERT_DOMAIN=${config.get('certificateDomain')} ./certbot_install.sh`
}, { dependsOn: chmodCertbotInstall });

exports.bucketName = bucket.id;
exports.bucketRegion = bucket.region;
exports.accessKey = userCredentials.id;
exports.secretKey = userCredentials.secret;
exports.dbName = config.get('dbName');
exports.dbUser = config.get('dbUser');
exports.dbPassword = config.getSecret('dbPassword').apply(v => `${v}`);
exports.dbHost = db.address;
exports.dbPort = db.port;
exports.publicIp = elasticIp;
// exports.provisionerResult = certbotInstall.results[0];
