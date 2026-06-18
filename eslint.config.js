import {FlatCompat} from '@eslint/eslintrc'
import {fileURLToPath} from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: path.resolve(__dirname, 'node_modules/eslint-plugin-github'),
})

export default [
  {
    ignores: ['dist/**'],
  },
  ...compat.extends('plugin:github/recommended', 'plugin:github/browser', 'plugin:github/typescript'),
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: (await import('espree')).default,
      parserOptions: {
        ecmaVersion: 8,
      },
    },
  },
]
