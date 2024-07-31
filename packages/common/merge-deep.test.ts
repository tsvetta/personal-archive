import { expect, test } from 'vitest';
import {
  mergeDeep,
  createNestedStructure,
  groupByDirectories,
} from './merge-deep.js';

test('createNestedStructure', () => {
  expect(
    createNestedStructure(['outerFolder', 'folder1', 'folder2'], 'file1')
  ).toStrictEqual({
    outerFolder: {
      folder1: {
        folder2: ['file1'],
      },
    },
  });
});

test('mergeDeep', () => {
  const obj1 = { archive: { photos: { family_album_scans: [1] } } };
  const obj2 = {
    archive: { photos: { family_album_scans: { abc: { def: 2 } } } },
  };

  expect(mergeDeep(obj1, obj2)).toStrictEqual({
    archive: { photos: { family_album_scans: [1, { abc: { def: 2 } }] } },
  });
});

test('groupByDirectories', () => {
  const files = [
    { fileName: 'archive/photos/2016/abc/ox8CBl7e7aU.jpg' },
    { fileName: 'archive/photos/2016/def/123.jpg' },
  ];

  const result = {
    archive: {
      photos: {
        2016: {
          abc: ['https://abc.com/archive/photos/2016/abc/ox8CBl7e7aU.jpg'],
          def: ['https://abc.com/archive/photos/2016/def/123.jpg'],
        },
      },
    },
  };

  expect(groupByDirectories(files, 'https://abc.com')).toStrictEqual(result);
});
