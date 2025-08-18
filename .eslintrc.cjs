module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es2021: true
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		ecmaFeatures: { jsx: true },
		project: undefined
	},
	settings: {
		react: { version: 'detect' }
	},
	plugins: ['@typescript-eslint', 'react', 'react-hooks', 'unused-imports'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended'
	],
	rules: {
		// Keep build green while we iteratively fix issues
		'no-console': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
		'unused-imports/no-unused-imports': 'error',
		'@typescript-eslint/no-explicit-any': 'off'
	},
	overrides: [
		{
			files: ['src/services/errorService.ts'],
			rules: { 'no-console': 'off' }
		},
		{
			files: ['**/*.test.ts', '**/*.test.tsx'],
			env: { jest: true },
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
				'react/display-name': 'off'
			}
		}
	],
	ignorePatterns: ['dist/**', 'coverage/**', 'supabase/**', 'api/dist/**', 'node_modules/**']
}