import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import dotenv from 'dotenv';

// Before run: create .env.test !
dotenv.config({ path: '.env.test' });

beforeEach(() => {
  window.history.pushState({}, 'Home', '/');
});

afterEach(() => {
  cleanup();
});
