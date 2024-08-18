import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, suite, beforeAll } from 'vitest';

import { createTestContext, TestContext } from './entry-tests.js';
import {
  mockLoginUserMutation,
  mockPostQuery,
  mockUserQuery,
} from './__mocks__/graphql/index.js';
import App from '../App.js';

describe('Login Page', () => {
  suite('logging in as TSVETTA', async () => {
    let t: TestContext;

    beforeAll(async () => {
      t = createTestContext();

      mockLoginUserMutation(t);
      mockUserQuery(t);
      mockPostQuery(t);

      await act(async () => {
        t.renderApp(<App />);
        expect(window.location.pathname).toBe('/');
      });
    });

    test('No username in header', async () => {
      const userElement: HTMLElement | null = await screen.queryByText(
        'User: tsvetta, role: TSVETTA'
      );
      expect(userElement).toBeNull();
    });

    test('API: query User not called', () => {
      expect(t.fetchMock.called('queryUser')).toBe(false);
    });

    test('Redirect to /login', async () => {
      await waitFor(() => {
        expect(window.location.pathname).toBe('/login');
      });
    });

    test('Fill auth form', async () => {
      const usernameInput: HTMLElement | null =
        await screen.queryByPlaceholderText('username');
      const passwordInput: HTMLElement | null =
        await screen.queryByPlaceholderText('password');
      const submitButton: HTMLElement = await screen.findByText('Войти');

      usernameInput &&
        fireEvent.input(usernameInput, { target: { value: 'tsvetta_test' } });
      passwordInput &&
        fireEvent.input(passwordInput, {
          target: { value: 'password123_test' },
        });

      expect(usernameInput).toHaveValue('tsvetta_test');
      expect(passwordInput).toHaveValue('password123_test');

      fireEvent.click(submitButton);
    });

    test('After submit: call mutation LoginUser', async () => {
      expect(t.fetchMock.called('mutationLoginUser')).toBe(true);
    });

    test('After submit: go to home page /', async () => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
