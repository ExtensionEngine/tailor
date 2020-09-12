'use strict';

const { ExportJob, ImportJob } = require('./job');
const logger = require('../logger');
const PromiseQueue = require('promise-queue');

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

module.exports = new TransferService();

function setupLogging(job) {
  job.once('success', () => logger.info({ job: job.toJSON() }, 'Job completed successfully'));
  job.once('error', err => logger.error({ job: job.toJSON(), err }, 'Job failed to complete'));
}
