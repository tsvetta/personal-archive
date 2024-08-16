const isCorrectApiUrl = (url: string) => {
  return url === 'http://localhost:5173/graphql';
};

const mockMatcher = (query: string) => (url: string, opts: any) => {
  if (!isCorrectApiUrl(url)) {
    return false;
  }

  const body = JSON.parse(opts.body);

  if (body.query.includes(query)) {
    return true;
  }

  return false;
};

export const mockUserQuery = (t: any) => {
  t.fetchMock.mock(
    mockMatcher('query User'),
    (_: string, opts: any) => {
      const body = JSON.parse(opts.body);

      return {
        status: 200,
        body: {
          data: {
            user: {
              _id: body.variables.id,
              username: 'tsvetta',
              role: 'TSVETTA',
              accessLevel: 4,
              refreshToken: '123123123',
            },
          },
        },
      };
    },
    'queryUser'
  );
};

export const mockPostQuery = (t: any) => {
  t.fetchMock.mock(
    mockMatcher('query Post'),
    {
      status: 200,
      body: {
        data: {
          posts: [
            {
              _id: '123123123123',
              date: 1723075200000,
              tags: [
                {
                  _id: '234234234234',
                  name: 'лошади',
                  __typename: 'Tag',
                },
              ],
              photos: [
                {
                  _id: '345345345345',
                  description: 'Ахалтекинская порода лошадей.',
                  file: {
                    fileUrl:
                      'https://tsvetta.s3.us-west-004.backblazeb2.com/archive/misc/Akhal-Teke_horse.JPG',
                    filePreview:
                      'https://tsvetta.s3.us-west-004.backblazeb2.com/archive/misc/Akhal-Teke_horse_thumb.JPG',
                    __typename: 'CDNPhoto',
                  },
                  __typename: 'Photo',
                },
              ],
              title: null,
              text: null,
              accessLevel: 0,
              __typename: 'Post',
            },
          ],
        },
      },
    },
    'queryPost'
  );
};
