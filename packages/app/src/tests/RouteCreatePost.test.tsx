import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, suite, beforeAll, afterAll } from 'vitest';
import FakeTimers, { InstalledClock } from '@sinonjs/fake-timers';

import {
  createTestTag,
  createTestBBFiles,
  createTestUser,
} from './helpers/create-test-data/index.js';
import { createTestContext, TestContext } from './entry-tests.js';

import App from '../App.js';
import { authorizeUser } from './helpers/check-authorization.js';

describe('Create Post Page', () => {
  let clock: InstalledClock;

  beforeAll(() => {
    clock = FakeTimers.install({
      now: new Date(2024, 7, 22).getTime(), // 2024-08-22
      toFake: ['Date'],
    });
  });

  afterAll(() => {
    clock.uninstall();
  });

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
      expect(dateInput).toHaveValue('2024-08-22'); // Date.now === 2024-08-22
      fireEvent.change(dateInput, { target: { value: '2024-08-20' } });
      expect(dateInput).toHaveValue('2024-08-20');
    });

    test('Fill Photos', async () => {
      const gallery = await screen.findByTestId('post-form-gallery');
      expect(gallery).toBeVisible();
      const galleryPhotosWrapper = await screen.findByTestId(
        'gallery-photos-wrapper'
      );
      expect(galleryPhotosWrapper).toBeEmptyDOMElement();

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
      expect(als).toHaveValue('');
      expect(als.className).not.toMatch(/error/);
      expect(als.className).not.toMatch(/success/);
    });
  });

  suite('Create post: photos from DB', async () => {
    let t: TestContext;

    beforeAll(async () => {
      t = await createTestContext();
      await createTestBBFiles(30);

      await act(async () => {
        t.renderApp(<App />);
      });

      await authorizeUser();

      const createPostLink = await screen.getByText('Create Post');
      fireEvent.click(createPostLink);
      expect(window.location.pathname).toBe('/create-post');
    });

    let galleryPhotosWrapper: HTMLElement;

    test('Load and show first 20 photos from CDN in gallery', async () => {
      const gallery = await screen.findByTestId('post-form-gallery');
      expect(gallery).toBeVisible();
      galleryPhotosWrapper = await screen.findByTestId(
        'gallery-photos-wrapper'
      );
      expect(galleryPhotosWrapper).toBeEmptyDOMElement();

      await waitFor(() => {
        expect(galleryPhotosWrapper).not.toBeEmptyDOMElement();
        expect(galleryPhotosWrapper.childElementCount).toBe(20);
      });
    });

    test('Click "load more" photos', async () => {
      const loadPhotosButton = await screen.findByTestId('gallery-load-more');
      fireEvent.click(loadPhotosButton);

      await waitFor(() => {
        expect(galleryPhotosWrapper.childElementCount).toBe(30);
      });
    });

    let photoURLInput: HTMLElement | null;
    let photoDescriptionInput: HTMLElement | null;
    let preview: HTMLElement | null;
    let firstPhoto: ChildNode | null | undefined;

    test('Click on 1st photo, add to input', async () => {
      photoURLInput = screen.queryByPlaceholderText('Photo URL');
      expect(photoURLInput).toBeNull();

      photoDescriptionInput =
        screen.queryByPlaceholderText('Photo Description');
      expect(photoDescriptionInput).toBeNull();

      firstPhoto = galleryPhotosWrapper.firstChild?.firstChild; // .photoWrapper > img
      firstPhoto && fireEvent.click(firstPhoto);

      await waitFor(async () => {
        photoURLInput = screen.queryByPlaceholderText('Photo URL');
        expect(photoURLInput).not.toBeNull();
        expect(photoURLInput).toHaveValue(`http://qwe.rt/tyu_0.png`);

        photoDescriptionInput =
          screen.queryByPlaceholderText('Photo Description');
        expect(photoDescriptionInput).not.toBeNull();
      });

      preview = await screen.findByTestId(`post-form-photo-preview_0`);
      expect(preview).toBeVisible();
      expect(preview).toHaveAttribute('src', 'http://qwe.rt/tyu_0.png');
    });

    test('Click on last photo (replace 1st photo URL)', async () => {
      const lastPhoto = galleryPhotosWrapper.lastChild?.firstChild; // .photoWrapper > img
      lastPhoto && fireEvent.click(lastPhoto);

      await waitFor(async () => {
        photoURLInput = screen.queryByPlaceholderText('Photo URL');
        expect(photoURLInput).not.toBeNull();
        expect(photoURLInput).toHaveValue(`http://qwe.rt/tyu_29.png`);

        photoDescriptionInput =
          screen.queryByPlaceholderText('Photo Description');
        expect(photoDescriptionInput).not.toBeNull();

        preview = await screen.findByTestId(`post-form-photo-preview_0`);
        expect(preview).toBeVisible();
        expect(preview).toHaveAttribute('src', 'http://qwe.rt/tyu_29.png');
      });
    });

    test('Add second photo', async () => {
      const addPhotoButton: HTMLElement = await screen.findByTestId(
        'add-photo-button'
      );
      fireEvent.click(addPhotoButton);

      let photoDescriptionInputs = await screen.findAllByPlaceholderText(
        'Photo Description'
      );
      expect(photoDescriptionInputs.length).toBe(2);

      firstPhoto && fireEvent.click(firstPhoto);

      let photoURLInputs = await screen.findAllByPlaceholderText('Photo URL');
      expect(photoURLInputs.length).toBe(2);
      expect(photoURLInputs[1]).toHaveValue(`http://qwe.rt/tyu_0.png`);
    });
  });

  suite('Create post: check tags from DB', async () => {
    let t: TestContext;

    beforeAll(async () => {
      t = await createTestContext();

      await createTestTag('cats');
      await createTestTag('dogs');
      await createTestTag('mice');

      await act(async () => {
        t.renderApp(<App />);
      });

      await authorizeUser();

      const createPostLink = await screen.getByText('Create Post');
      fireEvent.click(createPostLink);
      expect(window.location.pathname).toBe('/create-post');
    });

    let tagSuggestButton: HTMLElement;
    let selectedTag: HTMLElement;

    test('Load 3 tags, show them in suggest', async () => {
      const tagsInput = await screen.findByPlaceholderText('Input tags here');
      fireEvent.focus(tagsInput);

      const suggestionList = await screen.findByTestId('tags-suggestion-list');
      expect(suggestionList.className).toMatch(/open/);

      tagSuggestButton = await screen.findByTestId('tags-suggest-tag_0');

      expect(tagSuggestButton).toHaveTextContent('cats');
      expect(await screen.findByTestId('tags-suggest-tag_1')).toHaveTextContent(
        'dogs'
      );
      expect(await screen.findByTestId('tags-suggest-tag_2')).toHaveTextContent(
        'mice'
      );
    });

    test('Select tag', async () => {
      fireEvent.click(tagSuggestButton);

      selectedTag = await screen.findByTestId('tag-button_0');
      expect(selectedTag).toHaveTextContent('cats');
    });

    test('Unselect tag', async () => {
      fireEvent.click(selectedTag);

      expect(screen.queryByTestId('tag-button_0')).toBeNull();
    });
  });
});
