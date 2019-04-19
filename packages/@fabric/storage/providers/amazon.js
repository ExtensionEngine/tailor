'use strict';

const contentDisposition = require('content-disposition');
const Joi = require('joi');
const path = require('path');
const S3 = require('aws-sdk/clients/s3');

const isNotFound = err => err.code === 'NoSuchKey';
const DEFAULT_EXPIRATION_TIME = 3600; // seconds

const schema = Joi.object().keys({
  region: Joi.string().required(),
  bucket: Joi.string().required(),
  key: Joi.string().required(),
  secret: Joi.string().required()
});

class Amazon {
  constructor(config) {
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

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  saveFile(key, data, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Key: key, Body: data });
    return this.client.putObject(params).promise();
  }

  // API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property
  copyFile(key, newKey, options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket }, {
      CopySource: this.path(`/${key}`),
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

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
  listFiles(options = {}) {
    const params = Object.assign(options, { Bucket: this.bucket });
    return this.client.listObjects(params).promise();
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#headObject-property
  fileExists(key, options = {}) {
    const params = { Bucket: this.bucket, Key: key };
    return this.client.headObject(params).promise();
  }

  // API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
  getFileUrl(key, { expires, download, ...options } = {}) {
    const params = Object.assign(options, { Bucket: this.bucket, Key: key });
    params.Expires = expires || DEFAULT_EXPIRATION_TIME;
    if (download) {
      params.ResponseContentDisposition = contentDisposition(download);
    }
    return this._getSignedUrl('getObject', params);
  }

  getUploadConfig({ key, mimetype } = {}) {
    const Fields = {
      key,
      // NOTE: This has to be string because all form fields are mandated to be
      //       strings. (https://docs.aws.amazon.com/AmazonS3/latest/API/RESTObjectPOST.html#RESTObjectPOST-requests)
      success_action_status: '201',
      'Content-Type': mimetype
    };
    const params = { Bucket: this.bucket, Key: key, Fields };
    return this._getUploadConfig(params)
      .then(config => Object.assign(config, {
        isPublic: true,
        response: {
          type: 'document',
          keys: { key: './PostResponse/Key' }
        }
      }));
  }

  _getSignedUrl(operation, params) {
    return new Promise((resolve, reject) => {
      this.client.getSignedUrl(operation, params, (err, url) => {
        if (err) return reject(err);
        resolve(url);
      });
    });
  }

  _getUploadConfig(params) {
    return new Promise((resolve, reject) => {
      this.client.createPresignedPost(params, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }
}

module.exports = {
  schema,
  create: Amazon.create
};
