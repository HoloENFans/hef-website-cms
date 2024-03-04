module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'airbnb-base',
		'airbnb-typescript/base'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: './tsconfig.json'
	},
	plugins: [
		'@typescript-eslint',
		'import'
	],
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: './tsconfig.json'
			},
		},
	},
	rules: {
		indent: 'off',
		'no-bitwise': 'off',
		'no-tabs': 'off',
		'no-plusplus': ['error', {
			allowForLoopAfterthoughts: true,
		}],
		'@typescript-eslint/indent': ['error', 'tab'],
		'import/no-cycle': 'off',
	},
};
