import { ExportJob, ImportJob } from './job.js';
import createLogger from '../logger.js';
import PromiseQueue from 'promise-queue';

const logger = createLogger();

class TransferService {
  constructor() {
    this.queue = new PromiseQueue(1, Infinity);
  }

  createExportJob(outFile, options) {
    const exportJob = new ExportJob(outFile, options);
    this.queue.add(() => exportJob.run());
    setupLogging(exportJob);
    return exportJob;
  }

  createImportJob(inFile, options) {
    const importJob = new ImportJob(inFile, options);
    this.queue.add(() => importJob.run());
    setupLogging(importJob);
    return importJob;
  }
}

export default new TransferService();

function setupLogging(job) {
  job.once('success', () => logger.info({ job: job.toJSON() }, 'Job completed successfully'));
  job.once('error', err => logger.error({ job: job.toJSON(), err }, 'Job failed to complete'));
}
