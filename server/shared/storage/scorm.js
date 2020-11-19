'use strict';

const { getFileUrl, saveFile } = require('.');
const { readFile, sha256 } = require('./util');
const { ASSET_ROOT } = require('./helpers');
const JSZip = require('jszip');
const mime = require('mime-types');
const path = require('path');
const pickBy = require('lodash/pickBy');
const xmlParser = require('fast-xml-parser');

// PIF (package interchange file) is a ZIP file with SCORM compliant content
async function savePackage(pif) {
  const buffer = await readFile(pif);
  const hash = sha256(pif.originalname, buffer);
  const { name } = path.parse(pif.originalname);
  const location = `${hash}___${name}`;
  const content = await JSZip.loadAsync(buffer);
  await uploadAssets(content, location);
  const manifest = await getManifest(content);
  return getLaunchUrl(manifest, location);
}

module.exports = { savePackage };

function uploadAssets(content, location) {
  const assets = pickBy(content.files, isDir);
  return Promise.all(Object.keys(assets).map(async src => {
    const key = path.join(ASSET_ROOT, `${location}/${src}`);
    const file = await content.file(src).async('uint8array');
    const mimeType = mime.lookup(src);
    return saveFile(key, Buffer.from(file), { ContentType: mimeType });
  }));
}

function getLaunchUrl(manifest, location) {
  const { $_href: resourcePath } = manifest.resources.resource;
  const key = `${location}/${resourcePath}`;
  return getFileUrl(path.join(ASSET_ROOT, key));
}

async function getManifest(content) {
  const xml = await content.file('imsmanifest.xml').async('string');
  const options = { ignoreAttributes: false, attributeNamePrefix: '$_' };
  const { manifest } = xmlParser.parse(xml, options);
  return manifest;
}

function isDir(entry) {
  return !entry.dir;
}
