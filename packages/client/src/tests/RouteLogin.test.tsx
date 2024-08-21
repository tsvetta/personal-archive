import { act, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, suite, beforeAll } from 'vitest';

import { createTestUser } from './helpers/create-test-data/index.js';
import { createTestContext, TestContext } from './entry-tests.js';

import App from '../App.js';
import { authorizeUser } from './helpers/check-authorization.js';

describe('Login Page', () => {
  suite('Log in as TSVETTA: success', async () => {
    let t: TestContext;

    beforeAll(async () => {
      t = await createTestContext();
      await createTestUser();

      await act(async () => {
        t.renderApp(<App />);
        expect(window.location.pathname).toBe('/');
      });
    });

    test('Redirect to /login', async () => {
      await waitFor(() => {
        expect(window.location.pathname).toBe('/login');
      });
    });

    test('No username in header', async () => {
      const userElement: HTMLElement | null = await screen.queryByText(
        'User: tsvetta, role: TSVETTA'
      );
      expect(userElement).toBeNull();
    });

    test('Fill auth form', async () => {
      await authorizeUser();
    });

    test('Username and role in header', async () => {
      await waitFor(() => {
        expect(screen.getByText(/User: tsvetta, role: TSVETTA/i)).toBeVisible();
      });
    });
  });
});
