import { useQuery } from '@apollo/client';

import { getPosts } from '../../../server/apollo/queries.js';

import Post, { PostData } from '../../components/Post/index.js';
import { useAuth } from '../../features/auth/useAuth.js';

const MainPage = () => {
  const { user, logout } = useAuth();
  const { loading, error, data } = useQuery(getPosts);

  console.log('Main Page', user.userId);

  if (!user.userId) {
    logout();
  }

  if (error) {
    console.log('\n Main page error:', error);
    return error.message;
  }

  if (loading) {
    return 'Loading...';
  }

  if (data.posts.length === 0) {
    return 'No posts yet.';
  }

  return (
    <article className='article'>
      {data.posts.map((post: PostData) => {
        return <Post key={post._id} data={post} />;
      })}
    </article>
  );
};

export default MainPage;
