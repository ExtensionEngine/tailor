'use strict';

const corsAllowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .filter(s => s)
  .map(s => s.trim());

module.exports = {
  saltRounds: parseInt(process.env.AUTH_SALT_ROUNDS, 10) || 10,
  sessionSecret: process.env.AUTH_SESSION_SECRET,
  corsAllowedOrigins
};
