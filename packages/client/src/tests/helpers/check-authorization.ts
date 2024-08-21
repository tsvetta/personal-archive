import { Response } from 'supertest';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';

export const checkUnauthorizedResopnse = (response: Response) => {
  expect(response.body.errors).toBeDefined();
  expect(response.body.errors[0].message).toBe('Unauthorized');
  expect(response.body.errors[0].extensions.code).toBe(401);
};

export const authorizeUser = async () => {
  const usernameInput: HTMLElement | null = await screen.queryByPlaceholderText(
    'username'
  );
  const passwordInput: HTMLElement | null = await screen.queryByPlaceholderText(
    'password'
  );
  const submitButton: HTMLElement = await screen.findByText('Войти');

  usernameInput &&
    fireEvent.input(usernameInput, { target: { value: 'tsvetta' } });
  passwordInput &&
    fireEvent.input(passwordInput, {
      target: { value: 'test123123' },
    });

  expect(usernameInput).toHaveValue('tsvetta');
  expect(passwordInput).toHaveValue('test123123');

  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/');
  });
};
