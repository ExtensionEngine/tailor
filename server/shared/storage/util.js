import * as fsp from 'node:fs/promises';
import crypto from 'node:crypto';

function sha256(...args) {
  const hash = crypto.createHash('sha256');
  args.forEach(arg => hash.update(arg));
  return hash.digest('hex');
}

function readFile(file) {
  if (file.buffer) return Promise.resolve(file.buffer);
  return fsp.readFile(file.path);
}

export {
  sha256,
  readFile
};
