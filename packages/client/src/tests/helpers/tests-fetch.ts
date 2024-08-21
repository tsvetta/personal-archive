type TestFetch = (port: number) => typeof globalThis.fetch;

export const createTestsFetch: TestFetch =
  (port: number) => async (url, body) => {
    // http://localhost:5173/graphql
    const urlRegex = /^https?:\/\/[^\/]+\/([^\/]+)/;
    // graphql
    const apiSubstrUrl = url.toString().match(urlRegex) || '';

    try {
      const req = await window.fetch(
        `http://127.0.0.1:${port}/${apiSubstrUrl[1]}`,
        {
          ...body,
          headers: {
            ...body?.headers,
            cookie: await jsdom.cookieJar.getCookieString(location.origin),
          },
        }
      );

      await Promise.all(
        req.headers.getSetCookie().map(async (cookie) => {
          await jsdom.cookieJar.setCookie(cookie, location.origin);
        })
      );

      return req;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  };
