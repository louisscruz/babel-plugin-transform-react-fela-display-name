module.exports = {
  plugins: ['import', 'prettier', 'react'],
  extends: ['airbnb-base', 'prettier', 'plugin:react/recommended'],
  parser: 'babel-eslint',
  rules: {
    'prettier/prettier': 'error',
    'comma-dangle': ['error', 'never'],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
  },
  env: {
    jest: true
  }
};
