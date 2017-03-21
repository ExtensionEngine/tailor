const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URI);
const User = sequelize.import('../user/user.model');

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
