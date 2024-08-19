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

      expect(response.body.data.loginUser).toHaveProperty(
        'username',
        'tsvetta'
      );
      expect(response.body.data.loginUser).toHaveProperty('role', 'TSVETTA');
      expect(response.body.data.loginUser).toHaveProperty('accessLevel', 4);

      // --- AUTH TOKEN
      const setAuthTokenCookie = response.headers['set-cookie'][0];
      expect(setAuthTokenCookie).toMatch(setJWTTokenCookieRegex);

      const authTokenMatch = setAuthTokenCookie.match(
        /auth_token=([\w-]+\.[\w-]+\.[\w-]+)/
      );
      const authToken = authTokenMatch && authTokenMatch[1];
      const authTokenDecoded = jwt.decode(authToken || '');

      expect(authTokenDecoded).toHaveProperty(
        'userId',
        response.body.data.loginUser._id
      );
      expect(authTokenDecoded).toHaveProperty('username', 'tsvetta');
      expect(authTokenDecoded).toHaveProperty('role', 'TSVETTA');
      expect(authTokenDecoded).toHaveProperty('accessLevel', 4);

      // --- REFRESH TOKEN
      const setRefreshTokenCookie = response.headers['set-cookie'][1];
      expect(setRefreshTokenCookie).toMatch(setJWTTokenCookieRegex);

      const refreshTokenMatch = setRefreshTokenCookie.match(
        /refresh_token=([\w-]+\.[\w-]+\.[\w-]+)/
      );
      const refreshToken = refreshTokenMatch && refreshTokenMatch[1];
      const refreshTokenDecoded = jwt.decode(refreshToken || '');

      expect(refreshTokenDecoded).toHaveProperty(
        'userId',
        response.body.data.loginUser._id
      );
      expect(refreshTokenDecoded).toHaveProperty('username', 'tsvetta');
      expect(refreshTokenDecoded).toHaveProperty('role', 'TSVETTA');
      expect(refreshTokenDecoded).toHaveProperty('accessLevel', 4);

      expect(refreshToken).toEqual(response.body.data.loginUser.refreshToken);
    });
  });
});
