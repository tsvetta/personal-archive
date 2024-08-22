import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, suite, beforeAll } from 'vitest';

import {
  //   createTestBBFile,
  //   createTestTag,
  createTestUser,
} from './helpers/create-test-data/index.js';
import { createTestContext, TestContext } from './entry-tests.js';

import App from '../App.js';
import { authorizeUser } from './helpers/check-authorization.js';

describe('Create Post Page', () => {
  suite('Create post - empty DB: success', async () => {
    let t: TestContext;

    beforeAll(async () => {
      t = await createTestContext();
      await createTestUser();

      await act(async () => {
        t.renderApp(<App />);
      });

      await authorizeUser();
    });

    test('Go to /create-post', async () => {
      const createPostLink = await screen.getByText('Create Post');

      await waitFor(() => {
        expect(createPostLink).toBeVisible();
      });

      fireEvent.click(createPostLink);

      await waitFor(() => {
        expect(window.location.pathname).toBe('/create-post');
      });
    });

    test('Submit before filling in', async () => {
      const saveButon = await screen.findByText('Save');

      fireEvent.click(saveButon);
    });

    test('Validation fail', async () => {
      const ti = screen.getByPlaceholderText('Input tags here');
      expect(ti.className).toMatch(/error/);
      screen.getByText('Добавьте хотя бы 1 тег');

      const als = screen.getByTestId('access-level-select');
      expect(als.className).toMatch(/error/);
      screen.getByText('Выберите тип доступа');

      screen.getByText('Пост должен содержать фото и/или текст');
    });

    test('Fill Title', async () => {
      const titleInput: HTMLElement = await screen.findByPlaceholderText(
        'Заголовок поста'
      );

      fireEvent.change(titleInput, {
        target: { value: 'Новый пост о собаках' },
      });
      expect(titleInput).toHaveValue('Новый пост о собаках');
    });

    test('Fill Date', async () => {
      const addDateButton: HTMLElement = await screen.findByTestId(
        'add-date-button'
      );

      fireEvent.click(addDateButton);
      expect(addDateButton).not.toBeVisible();

      const dateInput: HTMLElement = await screen.findByTestId('date-input');
      expect(dateInput).toHaveValue('2024-08-22'); // TODAY
      fireEvent.change(dateInput, { target: { value: '2024-08-20' } });
      expect(dateInput).toHaveValue('2024-08-20');
    });

    test('Fill Photos', async () => {
      const saveButon = await screen.findByText('Save');
      const addPhotoButton: HTMLElement = await screen.findByTestId(
        'add-photo-button'
      );

      fireEvent.click(addPhotoButton);
      const photoURLInput: HTMLElement = await screen.findByPlaceholderText(
        'Photo URL'
      );
      const photoDescriptionInput: HTMLElement =
        await screen.findByPlaceholderText('Photo Description');

      // Photo URL validation
      fireEvent.click(saveButon);
      expect(photoURLInput.className).toMatch(/error/);
      screen.getByText('Поле не должно быть пустым');

      fireEvent.change(photoURLInput, {
        target: { value: 'http://qwe.rt/qwe.jpg' },
      });
      expect(photoURLInput).toHaveValue('http://qwe.rt/qwe.jpg');
      fireEvent.change(photoDescriptionInput, {
        target: { value: 'Фото собаки' },
      });
      expect(photoDescriptionInput).toHaveValue('Фото собаки');
    });

    test('Fill Tags', async () => {
      const tagsInput = await screen.findByPlaceholderText('Input tags here');

      fireEvent.focus(tagsInput);

      const suggestionList = await screen.findByTestId('tags-suggestion-list');

      // TODO в тестовом окружении отключать префиксы css-modules
      // expect(suggestionList).toBeVisible();
      // expect(suggestionList).toHaveClass('open');
      expect(suggestionList.className).toMatch(/open/);

      await screen.findByText('Click Space to create a new Tag');

      fireEvent.change(tagsInput, { target: { value: 'собаки' } });

      expect(tagsInput).toHaveValue('собаки');

      fireEvent.keyDown(tagsInput, {
        key: ' ',
        code: 'Space',
        keyCode: 32,
        charCode: 32,
      });

      await waitFor(async () => {
        // expect(suggestionList).not.toBeVisible();
        // expect(suggestionList).not.toHaveClass('open');
        expect(suggestionList.className).not.toMatch(/open/);
        const tagButton = await screen.findByText('собаки');
        expect(tagButton).toBeVisible();
      });
    });

    test('Fill Text', async () => {
      const textTextarea = await screen.findByPlaceholderText('Text');

      fireEvent.change(textTextarea, { target: { value: 'Текст о собаках' } });
    });

    test('Fill create post form', async () => {
      const accessLevelSelect = await screen.findByTestId(
        'access-level-select'
      );

      fireEvent.change(accessLevelSelect, { target: { value: '4' } });
      expect(accessLevelSelect).toHaveValue('4');
    });

    test('Submit form', async () => {
      const saveButon = await screen.findByText('Save');

      fireEvent.click(saveButon);
    });

    test('Validation success', async () => {
      const pui = screen.getByPlaceholderText('Photo URL');
      expect(pui.className).toMatch(/success/);

      const ti = screen.getByPlaceholderText('Input tags here');
      expect(ti.className).toMatch(/success/);

      const als = screen.getByTestId('access-level-select');
      expect(als.className).toMatch(/success/);
    });

    test('Form cleared', async () => {
      const t = await screen.findByPlaceholderText('Заголовок поста');
      expect(t).toHaveValue('');

      const db = await screen.findByTestId('add-date-button');
      expect(db).toBeVisible();

      const di = screen.queryByTestId('date-input');
      expect(di).toBeNull();

      const pui = screen.queryByPlaceholderText('Photo URL');
      const pdi = screen.queryByPlaceholderText('Photo Description');
      expect(pui).toBeNull();
      expect(pdi).toBeNull();

      const ti = await screen.findByPlaceholderText('Input tags here');
      expect(ti).toHaveValue('');
      expect(ti.className).not.toMatch(/error/);
      expect(ti.className).not.toMatch(/success/);

      const tsl = await screen.findByTestId('tags-suggestion-list');
      expect(tsl.className).not.toMatch(/open/);
      const tgs = await screen.findByTestId('add-tags-suggest');
      expect(tgs).toBeEmptyDOMElement();

      const ta = await screen.findByPlaceholderText('Text');
      expect(ta).toHaveValue('');

      const als = await screen.findByTestId('access-level-select');
      expect(als).toHaveValue(undefined);
      expect(als.className).not.toMatch(/error/);
      expect(als.className).not.toMatch(/success/);
    });
  });
});
