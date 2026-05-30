import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import sonarjs from 'eslint-plugin-sonarjs'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    "dist",
    "coverage",
    "node_modules",
    "eslint-report.html",
  ]),

  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      sonarjs,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // Detecta funciones muy grandes
      'max-lines-per-function': ['warn', {
        max: 40,
        skipBlankLines: true,
        skipComments: true,
      }],

      // Detecta funciones con demasiadas decisiones internas
      'complexity': ['warn', 8],

      // Detecta demasiados if/for anidados
      'max-depth': ['warn', 3],

      // Detecta números puestos directamente en el código
      'no-magic-numbers': ['warn', {
        ignore: [0, 1, -1],
        ignoreArrayIndexes: true,
        enforceConst: true,
      }],

      // Reglas útiles de SonarJS
      'sonarjs/cognitive-complexity': ['warn', 10],
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/no-duplicated-branches': 'warn',
      'sonarjs/no-all-duplicated-branches': 'warn',
      'sonarjs/no-collapsible-if': 'warn',
    },
  },

  {
    files: ["src/__tests__/**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      // En tests no conviene molestar con números de ejemplo
      'no-magic-numbers': 'off',
    },
  },
])