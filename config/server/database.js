module.exports = {
  uri: process.env.ARANGODB_URI || 'http://localhost:8529',
  name: process.env.DB_NAME || 'tailor-dev',
  postgresUri: process.env.POSTGRES_URI
};
