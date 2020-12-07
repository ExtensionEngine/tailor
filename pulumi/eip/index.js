'use strict';

const aws = require('@pulumi/aws');

const eip = new aws.ec2.Eip('eip', { vpc: true });

exports.eipId = eip.id;
exports.elasticIp = eip.publicIp;
