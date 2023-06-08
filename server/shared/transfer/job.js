import BlobStore from 'fs-blob-store';
import cuid from 'cuid';
import DefaultAdapter from './default/index.js';
import EventEmitter from 'events';
import Promise from 'bluebird';

const tmp = Promise.promisifyAll((await import('tmp')).default, { multiArgs: true });

const adapters = {
  default: DefaultAdapter
};

class TransferJob extends EventEmitter {
  constructor(filepath, options = {}) {
    super();
    this.id = cuid();
    this.filepath = filepath;
    this.options = options;
    this.type = this.constructor.name;
  }

  get adapter() {
    return adapters[this.options.adapter] || adapters.default;
  }

  async run() {
    const blobStore = await createBlobStore();
    return this._run(blobStore)
      .then(() => this.emit('success'))
      .catch(err => this.emit('error', err))
      .finally(() => blobStore.cleanup());
  }

  // TODO: remove after progress notifications are implemented
  toPromise() {
    return new Promise((resolve, reject) => {
      // NOTE: should also remove other event listener
      this.once('success', () => resolve(this));
      this.once('error', err => reject(err));
    });
  }

  toJSON() {
    return {
      id: this.id,
      filepath: this.filepath,
      options: this.options,
      type: this.type
    };
  }
}

class ExportJob extends TransferJob {
  _run(blobStore) {
    const { adapter, filepath, options } = this;
    return adapter.export(blobStore, options)
      .then(() => adapter.pack(blobStore, filepath, options));
  }
}

class ImportJob extends TransferJob {
  _run(blobStore) {
    const { adapter, filepath, options } = this;
    return adapter.unpack(filepath, blobStore, options)
      .then(() => adapter.import(blobStore, options));
  }
}

export {
  ExportJob,
  ImportJob
};

async function createBlobStore() {
  const options = { unsafeCleanup: true };
  const [tmpdir, cleanup] = await tmp.dirAsync(options);
  const store = new BlobStore(tmpdir);
  store.cleanup = cleanup;
  return store;
}
