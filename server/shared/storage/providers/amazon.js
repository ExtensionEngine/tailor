const Joi = require('Joi');
const s3 = require('s3');
const AWS = require('aws-sdk');
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

    const clientOptions = {
      maxAsyncS3: 20,
      s3RetryCount: 3,
      s3RetryDelay: 1000,
      multipartUploadThreshold: 20971520,
      multipartUploadSize: 15728640
    };

    const s3Options = {
      accessKeyId: validated.key,
      secretAccessKey: validated.secret,
      region: validated.region
    };

    // Workaround for: https://github.com/andrewrk/node-s3-client/issues/69
    const s3Client = new AWS.S3(s3Options);
    const options = Object.assign(clientOptions, { s3Client });

    this.bucket = validated.bucket;
    this.region = validated.region;
    this.client = s3.createClient(options);
  }

  /**
   * @description Takes in listener and event names. Rejects on error or
   * resolves otherwise.
   *
   * @param {object} listener Listener listening to the S3 event.
   * @param {string} success Name of success event.
   * @param {string} error Name of error event.
   * @return {Promise<listener>} Promisified event listener.
   */
  static promisifyListener(listener, success = 'end', error = 'error', data = 'data') {
    return new Promise((resolve, reject) => {
      let value = null;

      // If any data was emitted on 'data' event, store it inside value variable.
      // If any data was received on 'end' event, store that data in value
      // variable. Resolve with value variable.
      listener
        .on(error, reject)
        .on(data, d => {
          value = d;
        })
        .on(success, d => {
          if (d) value = d;
          resolve(value);
        });
    });
  }

  loadFile(key, location, options) {
    const s3Params = Object.assign(options, { Bucket: this.bucket, Key: key });
    const listener = this.client.downloadFile({ s3Params, localFile: location });
    return Amazon.promisifyListener(listener);
  }

  saveFile(key, file, options) {
    const s3Params = Object.assign(options, { Bucket: this.bucket, Key: key });
    const listener = this.client.uploadFile({ s3Params, localFile: file });
    return Amazon.promisifyListener(listener);
  }

  deleteFile(key, options) {
    const deleteParams = {
      Delete: {
        Objects: [
          {
            Key: key
          }
        ]
      }
    };
    const s3Params = Object.assign(options, deleteParams, { Bucket: this.bucket });
    const listener = this.client.deleteObjects(s3Params);
    return Amazon.promisifyListener(listener);
  }

  listFiles(options) {
    const s3Params = Object.assign(options, { Bucket: this.bucket });
    const listener = this.client.listObjects({ s3Params });
    return Amazon.promisifyListener(listener);
  }

  getFileUrl(key, options) {
    return new Promise((resolve, reject) => {
      const url = s3.getPublicUrl(this.bucket, key, this.region);
      if (!url) return reject(url);
      return resolve(url);
    });
  }

  fileExists(key, options) {
    return new Promise((resolve, reject) => {
      this.client.s3.headObject(
        { Key: key, Bucket: this.bucket },
        (err, data) => {
          if (err) return reject(err);
          return resolve(data);
        });
    });
  }
};

module.exports = {
  provider: Amazon
};
