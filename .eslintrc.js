// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  env: {},
  extends: ['airbnb-base'],
  globals: {},
  settings: {},
  rules: {
    'import/extensions': ['error', 'always', {
      js: 'never',
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'session', // for context sessions
        'ctx', // for koa routes
      ]
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      // optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'padded-blocks': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-mixed-operators': 'off',
    'arrow-body-style': 'off',
    'import/prefer-default-export': 'off',
    'prefer-object-spread': 'off',

  }
};
