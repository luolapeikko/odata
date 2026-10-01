import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		reporters: ['minimal', 'github-actions'],
		coverage: {
			exclude: ['**/dist/**', '**/test/**', '**/*.test-d.ts', '**/index.ts'],
			include: ['src/**/*.ts'],
			provider: 'v8',
			reporter: ['text', 'lcov'],
		},
	},
});
