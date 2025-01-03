import globals from "globals";
import plugin from '@stylistic/eslint-plugin-js';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: globals.node,
    },

    plugins: {
      '@stylistic/js': plugin
    },

    rules: {
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-console': 0,

      // Reglas de estilo con el plugin
      '@stylistic/js/indent': ['error', 2], // Indentación de 2 espacios
      '@stylistic/js/linebreak-style': ['error', 'unix'], // Saltos de línea estilo UNIX
      '@stylistic/js/quotes': ['error', 'single'], // Comillas simples
      '@stylistic/js/semi': ['error', 'never'], // Sin punto y coma al final
    }
  }
];
