import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { getBBCDNPhoto } from '@archive/app/src/apollo/queries.js';

import styles from './index.module.css';

const PhotoPage = () => {
  const { id: photoId } = useParams();

  const { data, error, loading } = useQuery(getBBCDNPhoto, {
    variables: {
      id: photoId,
    },
  });

  if (error) {
    console.error('\n Main page error:', error);

    return error.message;
  }

  if (loading) {
    return 'Loading...';
  }

  return (
    <article className='article'>
      <img src={data?.cdnPhoto?.fileUrl} alt='' className={styles.photo} />
    </article>
  );
};

export default PhotoPage;
