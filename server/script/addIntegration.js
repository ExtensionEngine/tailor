import 'dotenv/config';
import createLogger from '../shared/logger.js';
import roleConfig from '../../config/shared/role.js';

createLogger.enabled = false;

// Dynamic import is needed in order for the `enabled` flag to be respected
const { default: db } = await import('../shared/database/index.js');

const { User } = db;
const { user: role } = roleConfig;

User.findOne({ where: { role: role.INTEGRATION } })
  .then(user => {
    if (!user) return true;
    console.log('Integration already exists');
    process.exit(0);
  })
  .then(() => User.create({ role: role.INTEGRATION }))
  .then(user => {
    console.log(`Integration user created: ${user.id}`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
