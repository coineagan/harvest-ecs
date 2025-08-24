// vite.config.ts
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'path';

export default defineConfig({
	root: 'src/app',
	base: './',
	build: {
		outDir: path.resolve(__dirname, 'dist/renderer'),
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [
		electron([
			{
				entry: 'main.ts',
				vite: {
					build: {
						outDir: path.resolve(__dirname, 'dist/main'),
						rollupOptions: {
							external: ['electron'],
						},
					},
				},
			},
			{
				entry: 'preload.ts',
				vite: {
					build: {
						outDir: path.resolve(__dirname, 'dist/preload'),
						rollupOptions: {
							external: ['electron'],
						},
					},
				},
			},
		]),
		renderer(),
	],
	server: {
		port: 3000,
	},
});
