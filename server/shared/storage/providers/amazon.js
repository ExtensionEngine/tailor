const Joi = require('joi');
const last = require('lodash/last');
const path = require('path');
const Promise = require('bluebird');
const S3 = require('aws-sdk/clients/s3');
const validateConfig = require('../validation').validateConfig;

const schema = Joi.object().keys({
  region: Joi.string().required(),
  bucket: Joi.string().required(),
  key: Joi.string().required(),
  secret: Joi.string().required()
});

class Amazon {
  constructor(config) {
    config = validateConfig(config, schema);

    const s3Config = {
      accessKeyId: config.key,
      secretAccessKey: config.secret,
      region: config.region,
      apiVersion: '2006-03-01',
      maxRetries: 3
    };

    this.bucket = config.bucket;
    this.region = config.region;
    this.client = new S3(s3Config);
  }

  static getLocalPath(s3Path, localDir) {
    const filename = last(s3Path.split('/'));
    return path.join(localDir, filename);
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
  getFile(key, options) {
    return this.fileExists(key).then(exists => {
      if (!exists) return null;
      const s3Params = Object.assign(options, { Bucket: this.bucket, Key: key });
      const input = this.client.getObject(s3Params).createReadStream();
      return new Promise((resolve, reject) => {
        const chunks = [];
        input.on('end', () => resolve(Buffer.concat(chunks)));
        input.on('data', data => chunks.push(data));
        input.on('error', reject);
      });
    });
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  saveFile(key, file, options) {
    const s3Params = Object.assign(options, { Key: key, Bucket: this.bucket, Body: file });
    return this.client.putObject(s3Params).promise();
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property
  moveFile(key, newKey, options) {
    const params = {
      CopySource: `${this.bucket}/${key}`,
      Bucket: this.bucket,
      Key: newKey
    };
    const s3Params = Object.assign(options, params);
    return this.client.copyObject(s3Params).promise()
      .then(() => this.deleteFile(key));
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
  deleteFile(key, options) {
    const s3Params = Object.assign(options, { Key: key, Bucket: this.bucket });
    return this.client.deleteObject(s3Params).promise();
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
  listFiles(options) {
    const s3Params = Object.assign(options, { Bucket: this.bucket });
    return this.client.listObjects(s3Params).promise();
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
  getFileUrl(key, options) {
    const s3Params = Object.assign(options, { Key: key, Bucket: this.bucket, Expires: 3600 });
    return new Promise((resolve, reject) => {
      this.client.getSignedUrl('getObject', s3Params, (err, url) => {
        if (err) reject(err);
        resolve(url);
      });
    });
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#headObject-property
  fileExists(key, options) {
    const s3Params = { Key: key, Bucket: this.bucket };
    return new Promise((resolve, reject) => {
      this.client.headObject(s3Params, (err, data) => {
        if (err) resolve(false);
        resolve(true);
      });
    });
  }
};

module.exports = {
  provider: Amazon
};
