'use strict';

const corsAllowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .filter(s => s)
  .map(s => s.trim());

module.exports = {
  saltRounds: parseInt(process.env.AUTH_SALT_ROUNDS, 10) || 10,
  scheme: process.env.AUTH_JWT_SCHEME || 'JWT',
  secret: process.env.AUTH_JWT_SECRET,
  issuer: process.env.AUTH_JWT_ISSUER,
  corsAllowedOrigins
};
