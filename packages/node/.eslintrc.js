module.exports = {
  extends: ['plugin:@byted-lint/eslint-plugin-meta/react', 'plugin:@byted-lint/eslint-plugin-meta/typescript'],
  plugins: ['@byted-lint/eslint-plugin-meta'],
  settings: { react: { version: 'detect' } },
  env: {
    node: true,
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': [0],
  },
};
