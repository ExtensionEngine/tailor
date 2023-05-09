'use strict';

const {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const miss = require('mississippi');
const path = require('path');
const { Upload } = require('@aws-sdk/lib-storage');
const { validateConfig } = require('../validation');
const yup = require('yup');

const noop = () => {};
const isNotFound = err => err.Code === 'NoSuchKey';
const DEFAULT_EXPIRATION_TIME = 3600; // seconds

const schema = yup.object().shape({
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
      credentials: {
        accessKeyId: config.key,
        secretAccessKey: config.secret
      },
      region: config.region,
      apiVersion: '2006-03-01',
      maxRetries: 3
    };

    this.bucket = config.bucket;
    this.region = config.region;
    this.client = new S3Client(s3Config);
  }

  static create(config) {
    return new Amazon(config);
  }

  path(...segments) {
    segments = [this.bucket, ...segments];
    return path.join(...segments);
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
  getFile(key, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Key: key });
    return this.client
      .send(new GetObjectCommand(params))
      .then(({ Body: data }) => data.transformToByteArray())
      .then(Buffer.from)
      .catch(err => {
        if (isNotFound(err)) return null;
        return Promise.reject(err);
      });
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
  async createReadStream(key, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Key: key });
    const throughStream = miss.through();
    const s3Item = await this.client.send(new GetObjectCommand(params));
    s3Item.Body.pipe(throughStream);
    return throughStream;
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
  saveFile(key, data, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Key: key, Body: data });
    return this.client.send(new PutObjectCommand(params));
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/classes/_aws_sdk_lib_storage.Upload.html
  createWriteStream(key, options = {}) {
    const throughStream = miss.through();
    const params = Object.assign(options, { Bucket: this.bucket, Key: key, Body: throughStream });
    const upload = new Upload({ client: this.client, params });
    upload.done().catch(noop);
    return throughStream;
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/copyobjectcommand.html
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
    return this.client.send(new CopyObjectCommand(params));
  }

  moveFile(key, newKey, options = {}) {
    return this.copyFile(key, newKey, options)
      .then(result => this.deleteFile(key).then(() => result));
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/deleteobjectcommand.html
  deleteFile(key, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Key: key });
    return this.client.send(new DeleteObjectCommand(params));
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/deleteobjectscommand.html
  deleteFiles(keys, options = {}) {
    const objects = keys.map(key => ({ Key: key }));
    if (!keys.length) return Promise.resolve();
    const params = Object.assign(options, { Bucket: this.bucket, Delete: { Objects: objects } });
    return this.client.send(new DeleteObjectsCommand(params));
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/listobjectsv2command.html
  listFiles(key, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Prefix: key });
    return this.client
      .send(new ListObjectsV2Command(params))
      .then(({ Contents: files }) => files.map(file => file.Key));
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/headobjectcommand.html
  fileExists(key, options = {}) {
    const params = { Bucket: this.bucket, Key: key };
    return this.client.send(new HeadObjectCommand(params)).catch(err => {
      if (isNotFound(err)) return null;
      return Promise.reject(err);
    });
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
  getFileUrl(key, options = {}) {
    const expires = options.expires || DEFAULT_EXPIRATION_TIME;
    const params = Object.assign(options, { Bucket: this.bucket, Key: key });
    const command = new GetObjectCommand(params);
    return getSignedUrl(this.client, command, { expiresIn: expires });
  }
}

module.exports = {
  schema,
  create: Amazon.create
};
