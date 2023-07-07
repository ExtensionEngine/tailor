module.exports = {
  extends: [
    'stylelint-config-standard-scss', // configure for SCSS
    'stylelint-config-recommended-vue', // add overrides for .Vue files
    'stylelint-config-css-modules', // configure for CSS Modules methodology
    '@extensionengine/stylelint-config' // override with ExtensionEnigine custom rules
  ],
  overrides: [
    {
      files: ['src/**'],
      rules: {
        'selector-pseudo-class-no-unknown': null,
        'selector-class-pattern': null,
        'import-notation': null,
        'scss/at-extend-no-missing-placeholder': null
      }
    }
  ]
};
