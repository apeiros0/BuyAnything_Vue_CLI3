module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'max-len': [2, { ignoreStrings: true, code: 200 }],
    "linebreak-style": 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
