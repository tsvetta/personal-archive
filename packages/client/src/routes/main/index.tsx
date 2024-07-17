import { useQuery } from '@apollo/client';

import Post, { PostData } from '../../components/Post/index.js';

import { getPosts } from '../../../server/apollo/queries.js';

const MainPage = () => {
  const { loading, error, data } = useQuery(getPosts);

  if (error) {
    console.error('\n Main page error:', error);

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
