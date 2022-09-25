import('dotenv/config');

const config = {
  url: process.env.POSTGRES_URI,
  dialect: 'postgres'
};

export const development = config;
export const test = config;
export const production = config;
