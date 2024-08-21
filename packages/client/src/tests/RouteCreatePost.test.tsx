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

    test('Fill Title', async () => {
      const titleInput: HTMLElement = await screen.findByPlaceholderText(
        'Заголовок поста'
      );

      fireEvent.input(titleInput, 'Новый пост о собаках');
    });

    test('Fill Date', async () => {
      const addDateButton: HTMLElement = await screen.findByTestId(
        'add-date-button'
      );

      fireEvent.click(addDateButton);

      const dateInput: HTMLElement = await screen.findByTestId('date-input');
      expect(dateInput).toHaveValue('2024-08-21'); // TODAY
      fireEvent.change(dateInput, { target: { value: '2024-08-20' } });
      expect(dateInput).toHaveValue('2024-08-20');
    });

    test('Fill Photos', async () => {
      const addPhotoButton: HTMLElement = await screen.findByTestId(
        'add-photo-button'
      );

      fireEvent.click(addPhotoButton);
      const photoURLInput: HTMLElement = await screen.findByPlaceholderText(
        'Photo URL'
      );
      const photoDescriptionInput: HTMLElement =
        await screen.findByPlaceholderText('Photo Description');
      fireEvent.input(photoURLInput, 'http://qwe.rt/qwe.jpg');
      fireEvent.input(photoDescriptionInput, 'Фото собаки');
    });

    test('Fill Tags', async () => {
      const tagsInput = await screen.findByPlaceholderText('Input tags here');

      fireEvent.click(tagsInput);

      const suggestionList = await screen.findByTestId('tags-suggestion-list');

      //   expect(suggestionList).toBeVisible();
      //   expect(suggestionList).toHaveClass('open');

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
        // expect(suggestionList).not.toBeVisible(); // в тестовом окружении не видит нужные css стили
        // expect(suggestionList).not.toHaveClass('open');
        const tagButton = await screen.findByText('собаки');
        expect(tagButton).toBeVisible();
      });
    });

    test('Fill Text', async () => {
      const textTextarea = await screen.findByPlaceholderText('Text');

      fireEvent.input(textTextarea, 'Текст о собаках');
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
  });
});
