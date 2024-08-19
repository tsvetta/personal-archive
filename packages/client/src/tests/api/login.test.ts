import jwt from 'jsonwebtoken';
import request from 'supertest';
import { print } from 'graphql';
import { suite } from 'vitest';

import { getHashedPassword } from '@archive/common/crypt-pass.js';
import { loginUser } from '@archive/client/server/apollo/queries.js';
import { User } from '@archive/client/server/apollo/models.js';
import { createTestContext, TestContext } from '../entry-tests.js';

// auth_token=xxx.xxx.xxx; Max-Age=2592000; Path=/; Expires=Wed, 18 Sep 2024 09:02:14 GMT; HttpOnly; SameSite=Strict
const setJWTTokenCookieRegex =
  /(auth_token|refresh_token)=[\w-]+\.[\w-]+\.[\w-]+; Max-Age=\d+; Path=\/; Expires=.+; HttpOnly; SameSite=Strict/;

const checkTokenCookie = (tokenCookie: string, userId: string) => {
  expect(tokenCookie).toMatch(setJWTTokenCookieRegex);

  const tokenMatch = tokenCookie.match(
    /(auth_token|refresh_token)=([\w-]+\.[\w-]+\.[\w-]+)/
  );
  const token = tokenMatch && tokenMatch[2];
  const tokenDecoded = jwt.decode(token || '');

  expect(tokenDecoded).toHaveProperty('userId', userId);
  expect(tokenDecoded).toHaveProperty('username', 'tsvetta');
  expect(tokenDecoded).toHaveProperty('role', 'TSVETTA');
  expect(tokenDecoded).toHaveProperty('accessLevel', 4);
};

describe('Authorization', () => {
  suite('Successful authorization', () => {
    let t: TestContext;

    beforeAll(async () => {
      t = await createTestContext();
    });

    test('Create new user', async () => {
      const user = new User({
        username: 'tsvetta',
        password: await getHashedPassword('test123123'),
        role: 'TSVETTA',
        accessLevel: 4,
      });

      await user.save();
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

      expect(response.status).toBe(200);

      expect(response.body.data.loginUser).toHaveProperty('_id');
      expect(response.body.data.loginUser).toHaveProperty(
        'username',
        'tsvetta'
      );
      expect(response.body.data.loginUser).toHaveProperty('role', 'TSVETTA');
      expect(response.body.data.loginUser).toHaveProperty('accessLevel', 4);
      expect(response.body.data.loginUser).toHaveProperty('refreshToken');

      const { _id } = response.body.data.loginUser;

      const setAuthTokenCookie = response.headers['set-cookie'][0];
      checkTokenCookie(setAuthTokenCookie, _id);

      const setRefreshTokenCookie = response.headers['set-cookie'][1];
      checkTokenCookie(setRefreshTokenCookie, _id);
    });
  });
});
