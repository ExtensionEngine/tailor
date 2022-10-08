import * as yup from 'yup';
import miss from 'mississippi';
import path from 'node:path';
import S3 from 'aws-sdk/clients/s3';
import { validateConfig } from '../validation.js';

const noop = () => {};
const isNotFound = err => err.code === 'NoSuchKey';
const DEFAULT_EXPIRATION_TIME = 3600; // seconds

export const schema = yup.object().shape({
  region: yup.string().required(),
  bucket: yup.string().required(),
  key: yup.string().required(),
  secret: yup.string().required()
});

class Amazon {
  constructor(config) {
    config = validateConfig(config, schema);

    const s3Config = {
      signatureVersion: 'v4',
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

  static create(config) {
    return new Amazon(config);
  }

  path(...segments) {
    segments = [this.bucket, ...segments];
    return path.join(...segments);
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
  getFile(key, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Key: key });
    return this.client.getObject(params).promise()
      .then(({ Body: data }) => data)
      .catch(err => {
        if (isNotFound(err)) return null;
        return Promise.reject(err);
      });
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
  createReadStream(key, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Key: key });
    return this.client.getObject(params).createReadStream();
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  saveFile(key, data, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Key: key, Body: data });
    return this.client.putObject(params).promise();
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
  createWriteStream(key, options = {}) {
    const throughStream = miss.through();
    const params = Object.assign(options, { Bucket: this.bucket, Key: key, Body: throughStream });
    this.client.upload(params, noop);
    return throughStream;
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property
  copyFile(key, newKey, options = {}) {
    const { base, ...rest } = path.parse(key);
    const encodedSource = path.format({
      base: encodeURIComponent(base),
      ...rest
    });
    const params = Object.assign(options, { Bucket: this.bucket }, {
      CopySource: this.path(`/${encodedSource}`),
      Key: newKey
    });
    return this.client.copyObject(params).promise();
  }

  moveFile(key, newKey, options = {}) {
    return this.copyFile(key, newKey, options)
      .then(result => this.deleteFile(key).then(() => result));
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
  deleteFile(key, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Key: key });
    return this.client.deleteObject(params).promise();
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property
  deleteFiles(keys, options = {}) {
    const objects = keys.map(key => ({ Key: key }));
    if (!keys.length) return Promise.resolve();
    const params = Object.assign(options, { Bucket: this.bucket, Delete: { Objects: objects } });
    return this.client.deleteObjects(params).promise();
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
  listFiles(key, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Prefix: key });
    return this.client
      .listObjectsV2(params)
      .promise()
      .then(({ Contents: files }) => files.map(file => file.Key));
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#headObject-property
  fileExists(key, options = {}) {
    const params = { Bucket: this.bucket, Key: key };
    return this.client.headObject(params).promise();
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
  getFileUrl(key, options = {}) {
    const expires = options.expires || DEFAULT_EXPIRATION_TIME;
    const params = Object.assign(options, { Bucket: this.bucket, Key: key, Expires: expires });
    return this.client.getSignedUrlPromise('getObject', params);
  }
}

export const create = Amazon.create.bind(Amazon);
