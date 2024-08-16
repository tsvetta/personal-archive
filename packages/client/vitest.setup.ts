import '@testing-library/jest-dom/vitest';
import '@testing-library/react/dont-cleanup-after-each';
import { afterEach, beforeEach } from 'vitest';
import dotenv from 'dotenv';

// Before run: create .env.test !
dotenv.config({ path: '.env.test' });

beforeEach(() => {});
afterEach(() => {});
