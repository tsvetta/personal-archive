import { useQuery } from '@apollo/client';

import { getPosts } from '../../../server/apollo/index.js';

import Post, { PostData } from '../../components/Post/index.js';

const MainPage = () => {
  const { loading, error, data } = useQuery(getPosts);

  if (error) {
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
