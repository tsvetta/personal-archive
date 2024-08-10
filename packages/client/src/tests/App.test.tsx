import { act, screen, waitFor } from '@testing-library/react';
import { renderApp } from './entry-tests.js';
import { describe, test, expect } from 'vitest';
import App from '../App.js';

describe('App', () => {
  test('renders successfully: no user logged in', async () => {
    await act(async () => {
      renderApp(<App />);
    });

    const titleElement: HTMLElement = screen.getByText(/tsvetta archive/i);
    expect(titleElement).not.toBeNull();

    expect(window.location.href).toBe('http://localhost:3000/login');
  });

  test('renders successfully: user logged in, role TSVETTA', async () => {
    const userId = '668aa8e309d8ad3d9f837d57';

    await act(async () => {
      renderApp(<App />, {
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

    expect(window.location.href).toBe('http://localhost:3000/');
  });
});
