import request from 'supertest';
import { print } from 'graphql';
import { suite } from 'vitest';

import { getHashedPassword } from '@archive/common/crypt-pass.js';
import {
  getPosts,
  submitCreatePostForm,
  loginUser,
  addTag,
} from '@archive/client/server/apollo/queries.js';
import { User } from '@archive/client/server/apollo/models.js';
import { Tag } from '@archive/client/server/apollo/types.js';
import { createTestContext, TestContext } from '../entry-tests.js';
import { checkTokenCookie } from '../helpers/check-token-cookie.js';

describe('Posts', () => {
  suite('Get all posts: success', () => {
    let t: TestContext;
    let newUserId: string;
    let newUserRefreshToken: string | null;
    let newUserAuthToken: string | null;

    beforeAll(async () => {
      t = await createTestContext();

      const user = new User({
        username: 'tsvetta',
        password: await getHashedPassword('test123123'),
        role: 'TSVETTA',
        accessLevel: 4,
      });

      const newUser = await user.save();

      newUserId = newUser._id.toString();
    });

    test('Login', async () => {
      const response = await request(t.app)
        .post('/graphql')
        .send({
          operationName: 'LoginUser',
          query: print(loginUser),
          variables: {
            data: { username: 'tsvetta', password: 'test123123' },
          },
        });

      const setAuthTokenCookie = response.headers['set-cookie'][0];
      newUserAuthToken = checkTokenCookie(setAuthTokenCookie, newUserId);

      const setRefreshTokenCookie = response.headers['set-cookie'][1];
      newUserRefreshToken = checkTokenCookie(setRefreshTokenCookie, newUserId);
    });

    test('Get posts: empty', async () => {
      const response = await request(t.app)
        .post('/graphql')
        .set(
          'Cookie',
          `auth_token=${newUserAuthToken};refresh_token=${newUserRefreshToken}`
        )
        .send({
          operationName: 'Posts',
          query: print(getPosts),
        });

      expect(response.status).toBe(200);
      expect(response.body.data.posts).toStrictEqual([]);
    });

    let newTag: Tag;

    test('Create new tag', async () => {
      const response = await request(t.app)
        .post('/graphql')
        .set(
          'Cookie',
          `auth_token=${newUserAuthToken};refresh_token=${newUserRefreshToken}`
        )
        .send({
          query: print(addTag),
          variables: {
            name: 'коты',
          },
        });

      newTag = response.body.data.addTag;

      expect(newTag).toHaveProperty('_id');
      expect(newTag).toHaveProperty('name', 'коты');
    });

    let newPostId: string;

    test('Create new post', async () => {
      const response = await request(t.app)
        .post('/graphql')
        .set(
          'Cookie',
          `auth_token=${newUserAuthToken};refresh_token=${newUserRefreshToken}`
        )
        .send({
          query: print(submitCreatePostForm),
          variables: {
            data: {
              date: 1723939200000,
              title: 'Дорогой дневник',
              photos: [
                {
                  description: 'Фото кота',
                  src: 'https://gogogo.net/img.jpeg',
                },
              ],
              tags: [newTag._id],
              text: 'Сегодня я видел большого кота.',
              accessLevel: 4,
            },
          },
        });

      expect(response.body.data.addPost).toHaveProperty('_id');

      newPostId = response.body.data.addPost._id;
    });

    test('Get posts: have new post', async () => {
      const response = await request(t.app)
        .post('/graphql')
        .set(
          'Cookie',
          `auth_token=${newUserAuthToken};refresh_token=${newUserRefreshToken}`
        )
        .send({
          operationName: 'Posts',
          query: print(getPosts),
        });

      expect(response.status).toBe(200);
      expect(response.body.data.posts).toHaveLength(1);
      expect(response.body.data.posts[0]).toHaveProperty('_id', newPostId);
    });

    test('Unauthorized: get posts', async () => {
      const response = await request(t.app)
        .post('/graphql')
        .send({
          operationName: 'Posts',
          query: print(getPosts),
        });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toBe('Unauthorized');
      expect(response.body.errors[0].extensions.code).toBe(401);
    });

    test('Unauthorized: create tag', async () => {
      const response = await request(t.app)
        .post('/graphql')
        .send({
          query: print(addTag),
          variables: {
            name: 'коты',
          },
        });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toBe('Unauthorized');
      expect(response.body.errors[0].extensions.code).toBe(401);
    });

    test('Unauthorized: create post', async () => {
      const response = await request(t.app)
        .post('/graphql')
        .send({
          query: print(submitCreatePostForm),
          variables: {
            data: {
              date: '',
              title: '',
              photos: [],
              tags: [],
              text: '',
              accessLevel: 4,
            },
          },
        });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toBe('Unauthorized');
      expect(response.body.errors[0].extensions.code).toBe(401);
    });
  });
});
