import { useQuery, gql } from '@apollo/client';

import './index.css';
import commonStyles from './common.module.css';

import Post, { PostData } from './components/Post';

const getPosts = gql`
  query Posts {
    posts {
      _id
      date
      tags {
        _id
        name
      }
      photos {
        src
        description
      }
      title
      text
      privacy
    }
  }
`;

function App({ env }: { env: 'client' | 'server' }) {
  const { loading, error, data } = useQuery(getPosts);

  // const [cookies, setCookie] = useCookies(['name']);
  // console.log('cookiescookiescookies', env, cookies);

  if (error) {
    return error;
  }

  if (loading) {
    return 'Loading...';
  }

  if (data.posts.length === 0) {
    return 'No posts yet.';
  }

  return (
    <div className={commonStyles.page}>
      <h1 className={commonStyles.pageTitle}>tsvetta archive</h1>
      <div className='page-content'>
        <main className='main'>
          <article className='article'>
            <h2 className={commonStyles.articleTitle}>2007</h2>
            {data.posts.map((post: PostData) => {
              return <Post key={post._id} data={post} />;
            })}
          </article>
        </main>
      </div>
    </div>
  );
}

export default App;
