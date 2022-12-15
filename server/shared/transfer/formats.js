import { createGunzip, createGzip } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { pack as createTar, extract as createUntar } from 'tar-fs';
import Promise from 'bluebird';

const miss = Promise.promisifyAll(import('mississippi'));

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

export { useTar };
