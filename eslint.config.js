import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
	{ ignores: ['dist', 'vite.config.ts'] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			prettier: eslintPluginPrettier,
			'unused-imports': eslintPluginUnusedImports
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'prettier/prettier': [
				'warn'
				// {
				// 	tabWidth: 2,
				// 	useTabs: true,
				// 	semi: true,
				// 	trailingComma: 'none',
				// 	bracketSpacing: true,
				// 	arrowParens: 'avoid',
				// 	endOfLine: 'auto',
				// 	singleQuote: true,
				// 	printWidth: 120,
				// 	jsxSingleQuote: true
				// }
			]
			// 'unused-imports/no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }]
		}
	}
);
