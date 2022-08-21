import('dotenv/config');

const config = {
  url: process.env.POSTGRES_URI,
  dialect: 'postgres'
};

export default {
  development: config,
  test: config,
  production: config
};
