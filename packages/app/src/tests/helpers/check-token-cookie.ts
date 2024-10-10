import jwt from 'jsonwebtoken';

// auth_token=xxx.xxx.xxx; Max-Age=2592000; Path=/; Expires=Wed, 18 Sep 2024 09:02:14 GMT; HttpOnly; SameSite=Strict
const setJWTTokenCookieRegex =
  /(auth_token|refresh_token)=[\w-]+\.[\w-]+\.[\w-]+; Max-Age=\d+; Path=\/; Expires=.+; HttpOnly; SameSite=Strict/;

export const checkTokenCookie = (tokenCookie: string, userId: string) => {
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

  return token;
};
