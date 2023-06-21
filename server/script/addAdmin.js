import 'dotenv/config';
import createLogger from '../shared/logger.js';
import roleConfig from '../../config/shared/role.js';

createLogger.enabled = false;

// Dynamic import is needed in order for the `enabled` flag to be respected
const { default: db } = await import('../shared/database/index.js');

const { User } = db;
const { user: role } = roleConfig;

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('You must supply two arguments - email and password');
  process.exit(1);
}

const email = args[0];
const password = args[1];

User.create({ email, password, role: role.ADMIN })
  .then(user => {
    console.log(`Administrator created: ${user.email}`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
