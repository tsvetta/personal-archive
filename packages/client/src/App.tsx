import { useQuery, gql } from '@apollo/client';
import { Routes, Route } from 'react-router-dom';

import './index.css';
import commonStyles from './common.module.css';

import PageHeader from './components/PageHeader';

import MainPage from './routes/main';
import LoginPage from './routes/login';
import CreatePostPage from './routes/create-post';

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
      <PageHeader title={'tsvetta archive'} />
      <div className='page-content'>
        <main className='main'>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
 
};

export default App;
