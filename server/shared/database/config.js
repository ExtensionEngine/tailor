import 'dotenv/config';
import { createLogger, Level } from '../logger.js';

const isProduction = process.env.NODE_ENV === 'production';
const logger = createLogger('db', { level: Level.DEBUG });

export default parseConfig(process.env);

export const migrationStorageTableName = 'sequelize_meta';
export const benchmark = !isProduction;
export function logging(query, time) {
  const info = { query };
  if (time) info.duration = `${time}ms`;
  return logger.debug(info);
}

function parseConfig(config = process.env) {
  const DATABASE_URI = config.DATABASE_URI || config.POSTGRES_URI;
  if (DATABASE_URI) return { url: DATABASE_URI };
  if (!config.DATABASE_NAME) {
    throw new TypeError(`Invalid \`DATABASE_NAME\` provided: ${config.DATABASE_NAME}`);
  }
  return {
    database: config.DATABASE_NAME,
    username: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    dialect: config.DATABASE_ADAPTER || 'postgres'
  };
}
