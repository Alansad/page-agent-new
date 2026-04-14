// @ts-check
import { config as dotenvConfig } from 'dotenv'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env from repo root (optional)
dotenvConfig({ path: resolve(__dirname, '../../.env'), quiet: true })

// IIFE Bundle for CDN
// - aliases all local packages so that they can be bundled in
// - no external
export default defineConfig(() => ({
	plugins: [cssInjectedByJsPlugin({ relativeCSSInjection: true })],
	publicDir: false,
	esbuild: {
		keepNames: true,
	},
	resolve: {
		alias: {
			'@page-agent/page-controller': resolve(__dirname, '../page-controller/src/PageController.ts'),
			'@page-agent/llms': resolve(__dirname, '../llms/src/index.ts'),
			'@page-agent/core': resolve(__dirname, '../core/src/PageAgentCore.ts'),
			'@page-agent/ui': resolve(__dirname, '../ui/src/index.ts'),
		},
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/iife.ts'),
			name: 'PageAgent',
			fileName: () => `page-agent.iife.js`,
			formats: ['iife'],
		},
		outDir: resolve(__dirname, 'dist', 'iife'),
		cssCodeSplit: true,
		rollupOptions: {
			output: {
				// Make `window.PageAgent` be the exported class directly (default export),
				// instead of an object like `{ default: PageAgent }`.
				exports: 'default',
			},
			onwarn: function (message, handler) {
				if (message.code === 'EVAL') return
				handler(message)
			},
		},
	},
}))

