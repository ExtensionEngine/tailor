module.exports = {
  saltRounds: process.env.AUTH_SALT_ROUNDS || 10,
  sessionSecret: process.env.AUTH_SESSION_SECRET
}
