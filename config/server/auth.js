module.exports = {
  saltRounds: parseInt(process.env.AUTH_SALT_ROUNDS, 10) || 10,
  sessionSecret: process.env.AUTH_SESSION_SECRET
};
