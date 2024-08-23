import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    environment: 'jsdom',
    // fakeTimers: {
    //   now: new Date(2024, 7, 22).getTime(),
    //   toFake: ['Date', 'setTimeout', 'setInterval'],
    // },
  },
});
