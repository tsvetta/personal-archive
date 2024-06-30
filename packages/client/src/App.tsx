import { useQuery, gql } from '@apollo/client';
import { Routes, Route } from 'react-router-dom';

import './index.css';
import commonStyles from './common.module.css';

import Post, { PostData } from './components/Post';
import PageHeader from './components/PageHeader';

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

const App = () => {
  const { loading, error, data } = useQuery(getPosts);

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
    <div className={commonStyles.pageContainer}>
      {/* <Routes>
        <Route path="/" element={<div>home</div>} />
        <Route path="/login" element={<div>login</div>} />
        <Route path="/create-post" element={<div>create post</div>} />
        <Route path="*" element={<div>not found</div>} />
      </Routes> */}
      <PageHeader title={'tsvetta archive'} />
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
 
};

export default App;
