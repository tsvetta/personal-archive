import { act, screen, waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';

import { createTestContext } from './entry-tests.js';
import { mockPostQuery, mockUserQuery } from './__mocks__/graphql/index.js';
import App from '../App.js';

describe('App', () => {
  test('renders successfully: no user logged in', async () => {
    const t = createTestContext();

    expect(window.location.href).toBe('http://localhost:3000/');

    await act(async () => {
      t.renderApp(<App />);
    });

    const titleElement: HTMLElement = screen.getByText(/tsvetta archive/i);
    expect(titleElement).not.toBeNull();

    expect(window.location.href).toBe('http://localhost:3000/login');
  });

  test('renders successfully: user logged in, role TSVETTA', async () => {
    const t = createTestContext();
    const userId = '668aa8e309d8ad3d9f837d57';

    mockUserQuery(t);
    mockPostQuery(t);

    await act(async () => {
      t.renderApp(<App />, {
        userId,
        cookie: 'auth_token=123;refresh_token=456',
      });
    });
    expect(document.cookie).toBe('auth_token=123;refresh_token=456');

    await waitFor(() =>
      expect(
        screen.getByText(/User: tsvetta, role: TSVETTA/i)
      ).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(
        screen.getByText(/Ахалтекинская порода лошадей./i)
      ).toBeInTheDocument()
    );

    expect(window.location.href).toBe('http://localhost:3000/');
  });
});
