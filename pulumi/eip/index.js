'use strict';

const aws = require('@pulumi/aws');

// Create elastic IP address
const eip = new aws.ec2.Eip('eip', { vpc: true });

exports.id = eip.id;
exports.ip = eip.publicIp;
