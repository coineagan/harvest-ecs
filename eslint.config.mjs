import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
	{
		files: ['**/*.{js,ts,mjs,cjs}'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				...globals.node,
				...globals.browser,
			},
		},
		plugins: {
			js,
			'@typescript-eslint': tseslint.plugin,
			prettier: prettierPlugin,
		},
		rules: {
			...prettierPlugin.configs.recommended.rules,
			'prettier/prettier': 'error',
		},
	},
])
