import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { getPosts } from '../../apollo/queries.js';
import Post, { PostData } from '../../components/Post/index.js';

const TagPage = () => {
  const { tagId } = useParams();

  const { data, error, loading } = useQuery(getPosts, {
    variables: { filter: { tags: [tagId] } },
    skip: !tagId,
  });

  if (error) {
    console.error('\n Main page error:', error);

    return error.message;
  }

  if (loading) {
    return 'Loading...';
  }

  if (!data || !data.posts || data.posts.length === 0) {
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

export default TagPage;
