module.exports = {
  root: true,
  extends: ['@extensionengine', 'prettier'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    requireConfigFile: false,
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['src/**'],
      rules: {
        'vue/component-definition-name-casing': ['error', 'kebab-case']
      }
    }
  ],
  plugins: ['vue']
};
