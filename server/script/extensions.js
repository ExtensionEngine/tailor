'use strict';

const axios = require('axios');
const childProcess = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const program = require('commander');
const rimraf = require('rimraf');
const util = require('util');

const rimrafAsync = util.promisify(rimraf);
const EXTENSIONS_PATH = path.resolve('extensions', 'content-elements');

// TODO(marko): This is a very crude way to do this and it doesn't take into account a case when
// there's a repository with the same name, but hosted by different users or on different domains
// (one would overwrite the other). This is actually a symptom of a greater problem, which is
// ensuring the uniqueness/ownership across the extensions and it requires a much more robust
// solution. This will have to do for now though.
function extractRepoName(url) {
  let repoName = url.endsWith('.git') ? url.slice(0, -4) : url;

  return repoName.slice(repoName.lastIndexOf('/') + 1);
}

function spawnAsync(command, args, options) {
  return new Promise((resolve, reject) => {
    const opts = Object.assign({ stdio: [0, 1, 2] }, options);
    const proc = childProcess.spawn(command, args, opts);

    proc.on('exit', () => resolve(proc));
    proc.on('error', (err) => reject(err));
  });
}

async function importExtension(repositoryUrl) {
  const repoName = extractRepoName(repositoryUrl);

  if (repoName.startsWith('.')) {
    console.error('Invalid repository URL');
    process.exit = 1;
    return;
  }

  const repoPath = path.join(EXTENSIONS_PATH, repoName);

  try {
    await rimrafAsync(repoPath);
    // NOTE(marko): Since the `spawn` function doesn't create a shell, this is pretty secure as long
    // as the `shell` option is turned off. If the `shell` option is ever turned on for whatever
    // reason, or the `exec` function is used (which creates a shell by default), then the user
    // input, namely `repositoryUrl`, would need to be sanitized.
    await spawnAsync('git', ['clone', repositoryUrl], { cwd: EXTENSIONS_PATH });
    await spawnAsync('npm', ['install'], { cwd: repoPath });
    await spawnAsync('npm', ['run', 'build'], { cwd: repoPath });

    try {
      const { HOSTNAME, PORT, PROTOCOL } = dotenv.parse(fs.readFileSync('.env'));
      await axios.post(`${PROTOCOL}://${HOSTNAME}:${PORT}/api/v1/extensions`, {
        name: repoName,
        scriptPath: path.join(repoPath, 'dist', `${repoName}.iife.js`),
        stylePath: path.join(repoPath, 'dist', `${repoName}.iife.css`)
      });
      console.log('The extension was installed successfully.');
    } catch (err) {
      // Swallow the axios errors. It usually means the server was offline when the script was run.
      console.log(`
        Server is unavailable at this moment.
        The extension will be installed automatically once the server is restarted.
      `);
    }
  } catch (err) {
    console.error(err);
    process.exit = 1;
  }
}

/**
 * Example usage:
 * `npm run import https://github.com/vladimyr/tce-example`
 */
program
  .command('import <repositoryUrl>')
  .description('Import and install the Tailor extension from a given repository')
  .action(importExtension);

program.parse(process.argv);
