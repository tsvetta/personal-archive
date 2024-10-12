import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { getPost } from '../../apollo/queries.js';
import Post from '../../components/Post/index.js';

const PostPage = () => {
  const { id: postId } = useParams();
  const { data, loading, error } = useQuery(getPost, {
    variables: { id: postId },
    skip: !postId,
  });

  if (error) {
    console.error('\n Main page error:', error);

    return error.message;
  }

  if (loading) {
    return 'Loading...';
  }

  if (!data || !data.post) {
    return '404';
  }

  return (
    <article className='article'>
      <Post key={data.post._id} data={data.post} noLink />
    </article>
  );
};

export default PostPage;
