import { fileURLToPath } from 'node:url';
import path from 'node:path';
import('dotenv/config');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = path.join(__dirname, './server/shared/database/config.js');
export const seedersPath = path.join(__dirname, './server/shared/database/seeds');
export const migrationsPath = path.join(__dirname, './server/shared/database/migrations');

export default {
  config,
  seedersPath,
  migrationsPath
};
