import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import isEmpty from 'lodash/isEmpty.js';
import template from 'lodash/template.js';

const require = createRequire(import.meta.url);

export default function htmlReplace({ defaults = false, replacements = {} }) {
  return {
    name: 'html-replace',
    transformIndexHtml: {
      enforce: 'pre',
      transform: html => {
        if (!defaults && isEmpty(replacements)) {
          return html;
        }

        const mergedReplacements = {};

        if (defaults) {
          const pkg = require('../../../package.json');
          const rev = execSync('git rev-parse --short HEAD');

          Object.assign(mergedReplacements, {
            description: pkg.description,
            version: `${pkg.version}-rev-${rev} (${pkg.codename})`
          });
        }

        Object.assign(mergedReplacements, replacements);

        return template(html)(mergedReplacements);
      }
    }
  };
}
