import globals from "globals";
import pluginJs from "@eslint/js";
import module from "module"

/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Добавляем Prettier в расширения ESLint
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Включаем правила Prettier в ESLint
  },
};