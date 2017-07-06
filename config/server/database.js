require('dotenv').load();

module.exports = {
  development: {
    url: process.env.POSTGRES_URI,
    dialect: 'postgres'
  }
};
