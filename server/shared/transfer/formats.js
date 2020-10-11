'use strict';

const { createGunzip, createGzip } = require('zlib');
const { createReadStream, createWriteStream } = require('fs');
const { pack: createTar, extract: createUntar } = require('tar-fs');
const Promise = require('bluebird');

const miss = Promise.promisifyAll(require('mississippi'));

const useTar = Adapter => class extends Adapter {
  static pack(blobStore, outFile, { gzip = true } = {}) {
    return miss.pipeAsync(...[
      createTar(blobStore.path),
      gzip && createGzip(),
      createWriteStream(outFile)
    ].filter(Boolean));
  }

  static unpack(inFile, blobStore, { gunzip = true } = {}) {
    return miss.pipeAsync(...[
      createReadStream(inFile),
      gunzip && createGunzip(),
      createUntar(blobStore.path)
    ].filter(Boolean));
  }
};

module.exports = { useTar };
