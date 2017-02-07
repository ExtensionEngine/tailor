const fs = require('fs');
const Joi = require('Joi');
const last = require('lodash/last');
const trimEnd = require('lodash/trimEnd');
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
    const validated = validateConfig(config, schema);
    const s3Config = {
      accessKeyId: validated.key,
      secretAccessKey: validated.secret,
      region: validated.region,
      apiVersion: '2006-03-01',
      maxRetries: 3
    };

    this.bucket = validated.bucket;
    this.region = validated.region;
    this.client = new S3(s3Config);
  }

  static getLocalPath(s3Path, localDir) {
    const filename = last(s3Path.split('/'));
    const path = trimEnd(localDir, '/');
    return `${path}/${filename}`;
  }

  static streamToPromise(stream) {
    return new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
      stream.resume();
    });
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
  loadFile(key, location, options) {
    const s3Params = Object.assign(options, { Bucket: this.bucket, Key: key });
    const localPath = Amazon.getLocalPath(key, location);

    const input = this.client.getObject(s3Params).createReadStream();
    const output = fs.createWriteStream(localPath);
    input.pipe(output);

    // Promisify stream and return output path.
    return Amazon
      .streamToPromise(input)
      .then(() => output.path);
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  saveFile(key, file, options) {
    const s3Params = Object.assign(options, { Key: key, Bucket: this.bucket, Body: file });
    return this.client.putObject(s3Params).promise();
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
    const params = { Key: key, Bucket: this.bucket, Expires: 3600 };
    const s3Params = Object.assign(options, params);

    return new Promise((resolve, reject) => {
      this.client.getSignedUrl('getObject', s3Params, (err, url) => {
        if (err) return reject(err);
        return resolve(url);
      });
    });
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#headObject-property
  fileExists(key, options) {
    const s3Params = { Key: key, Bucket: this.bucket };
    return new Promise((resolve, reject) => {
      this.client.headObject(s3Params, (err, data) => {
        if (err) return reject(false);
        return resolve(true);
      });
    });
  }
};

module.exports = {
  provider: Amazon
};
