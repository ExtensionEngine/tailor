'use strict';

require('dotenv').config();

const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const { packageJson } = require('read-pkg-up').sync();
const { promisify } = require('util');
const readmeFilename = require('readme-filename');

const LF = '\n';
const DELIMITER = ':';

const readFile = path => promisify(fs.readFile)(path, 'utf-8');
const writeFile = (path, content) => promisify(fs.writeFile)(path, content);

if (require.main === module) {
  updateReadme(argv)
    .catch(err => console.error(err.stack) || 1)
    .then((code = 0) => process.exit(code));
}

async function updateReadme(argv) {
  const readmeFile = await readmeFilename(process.cwd());
  const readme = await readFile(readmeFile);
  const newReadme = updateEngines(readme);
  if (!newReadme) {
    console.error(`Error: Can't find engines list inside readme file: ${readmeFile}.`);
    process.exit(1);
  }
  if (argv.d || argv['dry-run']) {
    return console.log(newReadme);
  }
  await writeFile(readmeFile, newReadme);
  console.error(`Readme file: ${readmeFile} successfully updated.`);
}

function updateEngines(readme) {
  const { engines } = packageJson;
  const updates = Object.entries(engines).map(([name, version]) => {
    return `- **${name}** (${version})`;
  }).join(LF);
  return updateContent(readme, updates, { tagname: 'ENGINES-LIST' });
}

function updateContent(content, updates, { tagname }) {
  const commentStart = ['<!--', tagname].join(' ');
  const commentEnd = '-->';

  const offset = content.indexOf([commentStart, 'START'].join(DELIMITER));

  let startIndex = content.indexOf(commentEnd, offset);
  if (startIndex === -1) return;
  startIndex += commentEnd.length;

  const endIndex = content.indexOf([commentStart, 'END'].join(DELIMITER), startIndex);
  if (endIndex === -1) return;

  return [
    content.slice(0, startIndex),
    updates,
    content.slice(endIndex)
  ].join(LF);
}
