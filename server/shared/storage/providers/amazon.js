const Joi = require('Joi');
const s3 = require('s3');
const validateConfig = require('../validation').validateConfig;

const schema = Joi.object().keys({
  region: Joi.string().required(),
  bucket: Joi.string().required(),
  key: Joi.string().required(),
  secret: Joi.string().required()
});

// TODO(marko): Process and adapt necessary options.
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

    const options = Object.assign(clientOptions, { s3Options });

    this.bucket = validated.bucket;
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
   // NOTE(marko): All methods emit several different events. Perhaps promises
   // aren't the best solution? Look into RXJS.
  static promisifyListener(listener, success = 'end', error = 'error') {
    return new Promise((resolve, reject) => {
      listener.on(success, resolve).on(error, reject);
    });
  }

  // NOTE(marko): https://github.com/andrewrk/node-s3-client#clientdownloadfileparams
  // downloadFile emits three events. 'error' (err), 'end' and
  // 'progress' (progressAmount, progressTotal).
  getFile(options) {
    const listener = this.client.downloadFile(options);
    return Amazon.promisifyListener(listener);
  }

  // NOTE(marko): https://github.com/andrewrk/node-s3-client#clientlistobjectsparams
  // listObjects emits four events: 'error' (err), 'end', 'data' (data),
  // 'progress' (progressAmount, objectsFound, dirsFound).
  // Considering that returned data is found in 'data' event and 'end' marks
  // the end of download, how to safely return data inside a promise?
  listFiles(options) {
    options = Object.assign(options, { Bucket: this.bucket });
    const listener = this.client.listObjects({ s3Params: options });
    return Amazon.promisifyListener(listener, 'data');
  }

  // NOTE(marko): https://github.com/andrewrk/node-s3-client#clientuploadfileparams
  // uploadFile emits five events: 'error' (err), 'end' (data),
  // 'progress' (progressMd5Amount, progressAmount. progressTotal),
  // 'fileOpened' (fdSlicer) and 'fileClosed'.
  // This time 'end' event returns upload data so it's somewhat save to use
  // it as a promise resolve.
  saveFile(file, options) {
    options = Object.assign(options, { Bucket: this.bucket });
    const listener = this.client.uploadFile({ s3Params: options, localFile: file });
    return Amazon.promisifyListener(listener);
  }

  // NOTE(marko): https://github.com/andrewrk/node-s3-client#clientdeleteobjectss3params
  // deleteObjects emits four events. 'error' (err), 'end',
  // 'progress' (progressAmount, progressTotal), 'data' (data).
  // Again, data is not returned on 'end' event.
  deleteFile(options) {
    // NOTE(marko): Objects are repersented as a list of JS objects with key
    // attribute.
    const listener = this.client.deleteObjects();
    return Amazon.promisifyListener(listener);
  }

  // Should be safe for promisifying.
  getFileUrl(options) {
    const { bucket, key, location } = options;
    const listener = this.client.getPublicUrl(bucket, key, location);
    return Amazon.promisifyListener(listener);
  }

  // Should be safe for promisifying.
  fileExists(options) {
    const { bucket, key } = options;

    return new Promise((resolve, reject) => {
      this.client.headObject({ bucket, key }, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  }
};

module.exports = {
  provider: Amazon
};
