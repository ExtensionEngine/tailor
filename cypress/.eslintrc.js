module.exports = {
  root: true,
  extends: ['@extensionengine', 'plugin:cypress/recommended'],
  plugins: ['eslint-plugin-cypress'],
  env: { 'cypress/globals': true },
  parserOptions: {
    sourceType: 'module'
  }
};
