import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, suite, beforeAll } from 'vitest';

import { createTestContext, TestContext } from './entry-tests.js';
import App from '../App.js';

import {
  createTestUser,
  createTestPost,
  createTestTag,
} from './helpers/create-test-data/index.js';
import { authorizeUser } from './helpers/check-authorization.js';

describe('App', () => {
  suite('User: none', () => {
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

    test('Redirect to /login', async () => {
      await waitFor(() => {
        expect(window.location.pathname).toBe('/login');
      });
    });
  });

  suite('User: TSVETTA, manager buttons visilbe in posts', () => {
    let t: TestContext;

    beforeAll(async () => {
      t = await createTestContext();

      await act(async () => {
        await createTestUser();
        const newTag = await createTestTag('коты');
        await createTestPost({ tags: [newTag._id.toString()] });
        t.renderApp(<App />);
      });
    });

    test('Fill auth form', async () => {
      await authorizeUser();
    });

    test('Username in header', async () => {
      await waitFor(async () => {
        const userElement: HTMLElement | null = await screen.queryByText(
          'User: tsvetta, role: TSVETTA'
        );
        expect(userElement).toBeVisible();
      });
    });

    test('Edit button visible', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Редактировать/i)).toBeVisible();
      });
    });

    test('Delete button visible', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Удалить/i)).toBeVisible();
      });
    });

    test('Post rendered correctly', () => {
      expect(screen.getByText(/18.08.2024/i)).toBeVisible();
      expect(screen.getByText(/Дорогой дневник/i)).toBeVisible();
      expect(screen.getByText(/Сегодня я видел большого кота./i)).toBeVisible();
      expect(screen.getByText(/Фото кота/i)).toBeVisible();
      expect(screen.getByText(/Доступ: Никому/i)).toBeVisible();
      expect(screen.getByText(/коты/i)).toBeVisible();
    });
  });

  suite('Logout', () => {
    let t: TestContext;

    beforeAll(async () => {
      t = await createTestContext();

      await act(async () => {
        t.renderApp(<App />);
      });
    });

    test('Fill auth form', async () => {
      await authorizeUser();
    });

    test('Logout button visible', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Logout/i)).toBeVisible();
      });
    });

    test('Logout', () => {
      const logoutButton = screen.getByText(/Logout/i);
      fireEvent.click(logoutButton);
    });

    test('No username in header', async () => {
      await waitFor(async () => {
        const userElement: HTMLElement | null = await screen.queryByText(
          'User: tsvetta, role: TSVETTA'
        );
        expect(userElement).toBeNull();
      });
    });

    test('Redirect to /login', async () => {
      await waitFor(() => {
        expect(window.location.pathname).toBe('/login');
      });
    });
  });
});
