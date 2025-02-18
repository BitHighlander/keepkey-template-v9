module.exports = {
  extends: 'next/core-web-vitals',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    'react-hooks/exhaustive-deps': 'warn'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-empty-object-type': 'off'
      }
    }
  ]
} 