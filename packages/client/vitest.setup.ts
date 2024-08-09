import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Before run: create .env.test !

afterEach(() => {
  cleanup();
});
