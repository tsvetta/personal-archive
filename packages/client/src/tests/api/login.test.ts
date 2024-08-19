import request from 'supertest';
import { print } from 'graphql';
import { suite } from 'vitest';

import { getHashedPassword } from '@archive/common/crypt-pass.js';
import { getUser, loginUser } from '@archive/client/server/apollo/queries.js';
import { User } from '@archive/client/server/apollo/models.js';
import { createTestContext, TestContext } from '../entry-tests.js';
import { checkTokenCookie } from '../helpers/check-token-cookie.js';

describe('Authorization', () => {
  suite('Success', () => {
    let t: TestContext;
    let newUserId: string;
    let newUserRefreshToken: string;
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

      expect(response.status).toBe(200);

      expect(response.body.data.loginUser).toHaveProperty('_id', newUserId);
      expect(response.body.data.loginUser).toHaveProperty(
        'username',
        'tsvetta'
      );
      expect(response.body.data.loginUser).toHaveProperty('role', 'TSVETTA');
      expect(response.body.data.loginUser).toHaveProperty('accessLevel', 4);
      expect(response.body.data.loginUser).toHaveProperty('refreshToken');

      newUserRefreshToken = response.body.data.loginUser.refreshToken;

      const setAuthTokenCookie = response.headers['set-cookie'][0];
      newUserAuthToken = checkTokenCookie(setAuthTokenCookie, newUserId);

      const setRefreshTokenCookie = response.headers['set-cookie'][1];
      checkTokenCookie(setRefreshTokenCookie, newUserId);
    });

    test('Get user', async () => {
      const response = await request(t.app)
        .post('/graphql')
        .set(
          'Cookie',
          `auth_token=${newUserAuthToken};refresh_token=${newUserRefreshToken}`
        )
        .send({
          operationName: 'User',
          query: print(getUser),
          variables: {
            id: newUserId,
          },
        });

      expect(response.status).toBe(200);

      const { user } = response.body.data;

      expect(user).toHaveProperty('_id', newUserId);
      expect(user).toHaveProperty('username', 'tsvetta');
      expect(user).toHaveProperty('role', 'TSVETTA');
      expect(user).toHaveProperty('accessLevel', 4);
      expect(user).toHaveProperty('refreshToken', newUserRefreshToken);
    });

    test('Unauthorized access to User query', async () => {
      const response = await request(t.app)
        .post('/graphql')
        .send({
          operationName: 'User',
          query: print(getUser),
          variables: {
            id: newUserId,
          },
        });

      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message).toBe('Unauthorized');
      expect(response.body.errors[0].extensions.code).toBe(401);
    });
  });
});
