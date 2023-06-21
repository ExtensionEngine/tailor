import 'dotenv/config';
import createLogger from '../shared/logger.js';

createLogger.enabled = false;

// Dynamic import is needed in order for the `enabled` flag to be respected
const { default: db } = await import('../shared/database/index.js');

const { User } = db;

User.findOne({ where: { role: 'INTEGRATION' } })
  .then(user => user.createToken({}))
  .then(token => {
    console.log(`Integration token generated: ${token}`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message || err);
    process.exit(1);
  });
