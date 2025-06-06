import { sentrySvelteKit } from '@sentry/sveltekit';
import spotlight from '@spotlightjs/spotlight/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    sveltekit(),
    sentrySvelteKit({ autoUploadSourceMaps: false }),
    spotlight({ integrationNames: ['sentry'], debug: true }),
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
