import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['tests/unit/**/*.test.ts'],
		exclude: ['node_modules', 'dist', 'tests/e2e'],
		coverage: {
			reporter: ['text', 'html'],
			exclude: [
				'node_modules/',
				'tests/',
				'dist/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/mockData',
			],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});