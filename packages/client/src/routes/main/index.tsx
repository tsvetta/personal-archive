import { useQuery, gql } from '@apollo/client';

import Post, { PostData } from '../../components/Post';

import commonStyles from '../../common.module.css';

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
      <h2 className={commonStyles.articleTitle}>2007</h2>
      {data.posts.map((post: PostData) => {
        return <Post key={post._id} data={post} />;
      })}
    </article>
  );
};

export default MainPage;
