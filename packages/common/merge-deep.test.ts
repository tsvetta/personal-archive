import { expect, test } from 'vitest';
import {
  mergeDeep,
  createNestedStructure,
  groupByDirectories,
} from './merge-deep.js';

test('createNestedStructure', () => {
  const path = ['outerFolder', 'folder1', 'folder2'];

  const result = {
    outerFolder: {
      folder1: {
        folder2: ['file1'],
      },
    },
  };

  expect(createNestedStructure(path, 'file1')).toStrictEqual(result);
});

test('mergeDeep', () => {
  const obj1 = {
    archive: {
      photos: {
        family_album_scans: [1],
      },
    },
  };
  const obj2 = {
    archive: {
      photos: {
        family_album_scans: { abc: { def: 2 } },
      },
    },
  };

  const result = {
    archive: {
      photos: {
        family_album_scans: [1, { abc: { def: 2 } }],
      },
    },
  };

  expect(mergeDeep(obj1, obj2)).toStrictEqual(result);
});

test('groupByDirectories', () => {
  const files = [
    { fileName: 'archive/photos/2016/abc/ox8CBl7e7aU.jpg' },
    { fileName: 'archive/photos/2016/def/123.jpg' },
    { fileName: 'archive/photos/2016/def/124.jpg' },
    { fileName: 'archive/photos/2016/fgh/126.jpg' },
    { fileName: 'archive/photos/2016/2016-summer-kskustizhora-berta/1.jpg' },
    { fileName: 'archive/photos/2016/2016-summer-kskustizhora-berta/2.jpg' },
    { fileName: 'archive/photos/2016/2016-summer-kskustizhora-berta/3.jpg' },
  ];

  const result = {
    archive: {
      photos: {
        2016: {
          abc: ['https://abc.com/archive/photos/2016/abc/ox8CBl7e7aU.jpg'],
          def: [
            'https://abc.com/archive/photos/2016/def/123.jpg',
            'https://abc.com/archive/photos/2016/def/124.jpg',
          ],
          fgh: ['https://abc.com/archive/photos/2016/fgh/126.jpg'],
          '2016-summer-kskustizhora-berta': [
            'https://abc.com/archive/photos/2016/2016-summer-kskustizhora-berta/1.jpg',
            'https://abc.com/archive/photos/2016/2016-summer-kskustizhora-berta/2.jpg',
            'https://abc.com/archive/photos/2016/2016-summer-kskustizhora-berta/3.jpg',
          ],
        },
      },
    },
  };

  expect(groupByDirectories(files, 'https://abc.com')).toStrictEqual(result);
});

test('groupByDirectories 2', () => {
  const files = [
    { fileName: 'archive/photos/2016/0.jpg' },
    { fileName: 'archive/photos/2016/def/123.jpg' },
    { fileName: 'archive/photos/2016/def/124.jpg' },
  ];

  const result = {
    archive: {
      photos: {
        2016: [
          'https://abc.com/archive/photos/2016/0.jpg',
          {
            def: [
              'https://abc.com/archive/photos/2016/def/123.jpg',
              'https://abc.com/archive/photos/2016/def/124.jpg',
            ],
          },
        ],
      },
    },
  };

  expect(groupByDirectories(files, 'https://abc.com')).toStrictEqual(result);
});

test('groupByDirectories 3', () => {
  const files = [
    { fileName: 'archive/photos/2016/0.jpg' },
    { fileName: 'archive/photos/2016/2016-summer-kskustizhora-berta/3.jpg' },
  ];

  const result = {
    archive: {
      photos: {
        2016: [
          'https://abc.com/archive/photos/2016/0.jpg',
          {
            '2016-summer-kskustizhora-berta': [
              'https://abc.com/archive/photos/2016/2016-summer-kskustizhora-berta/3.jpg',
            ],
          },
        ],
      },
    },
  };

  expect(groupByDirectories(files, 'https://abc.com')).toStrictEqual(result);
});
