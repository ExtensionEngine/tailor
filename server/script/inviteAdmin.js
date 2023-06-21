import 'dotenv/config';
import createLogger from '../shared/logger.js';
import Deferred from '../shared/util/Deferred.js';
import roleConfig from '../../config/shared/role.js';

createLogger.enabled = false;

// Dynamic import is needed in order for the `enabled` flag to be respected
const { default: db } = await import('../shared/database/index.js');

const { User } = db;
const { user: role } = roleConfig;

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('You must supply email');
  process.exit(1);
}

const email = args[0];
const mailing = new Deferred();

User.invite({ email, role: role.ADMIN }, mailing.callback)
  .then(user => Promise.all([user, mailing.promise]))
  .then(([user]) => {
    console.log(`Invitation sent to ${user.email} for Admin role.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
