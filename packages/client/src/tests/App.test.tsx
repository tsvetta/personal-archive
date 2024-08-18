import { act, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, suite, beforeAll } from 'vitest';

import { createTestContext, TestContext } from './entry-tests.js';
import { mockPostQuery, mockUserQuery } from './__mocks__/graphql/index.js';
import App from '../App.js';

describe('App', () => {
  suite('No user logged in', async () => {
    let t: TestContext;

    beforeAll(async () => {
      t = await createTestContext();

      await act(async () => {
        t.renderApp(<App />);
        expect(window.location.pathname).toBe('/');
      });
    });

    test('Title visible', () => {
      const titleElement: HTMLElement = screen.getByText(/tsvetta archive/i);
      expect(titleElement).not.toBeNull();
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
  });

  suite('User logged in as TSVETTA', () => {
    const userId = '123qwe123qwe123qwe';
    let t: TestContext;

    beforeAll(async () => {
      t = await createTestContext();

      mockUserQuery(t);
      mockPostQuery(t);

      await act(async () => {
        t.renderApp(<App />, {
          userId,
          cookie: 'auth_token=123;refresh_token=456',
        });
      });

      expect(window.location.pathname).toBe('/');
      expect(document.cookie).toBe('auth_token=123;refresh_token=456');
    });

    test('API calls', () => {
      expect(t.fetchMock.called('queryUser')).toBe(true);
      expect(t.fetchMock.called('queryPost')).toBe(true);
    });

    test('Username and role in header', () => {
      expect(screen.getByText(/User: tsvetta, role: TSVETTA/i)).toBeVisible();
    });

    test('Edit button visible', () => {
      expect(screen.getByText(/Редактировать/i)).toBeVisible();
    });

    test('Delete button visible', () => {
      expect(screen.getByText(/Удалить/i)).toBeVisible();
    });

    test('Post rendered correctly', () => {
      expect(screen.getByText(/08.08.2024/i)).toBeVisible();
      expect(screen.getByText(/Ахалтекинская порода лошадей./i)).toBeVisible();
      expect(screen.getByText(/Доступ: Всем/i)).toBeVisible();
      expect(screen.getByText(/Лошади/i)).toBeVisible();
    });

    test('No redirect because of authorization', () => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
