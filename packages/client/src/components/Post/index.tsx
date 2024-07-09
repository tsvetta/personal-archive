import { Key } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import Photo from '../Photo';
import Tags, { TagData } from '../Tags';
import Button from '../Button';

import { deletePostMutation } from '../../../server/apollo/index.js';

import commonStyles from '../../common.module.css';
import styles from './index.module.css';
import { Privacy } from '../../../server/apollo/types.js';

export type PhotoData = {
  _id: Required<Key>;
  src: Required<string>;
  description: string;
};

export type PostData = {
  _id: Required<Key>;
  date: Required<Date>;
  tags: [TagData];
  photos: [PhotoData];
  title: string;
  text: [string];
  privacy: Required<Privacy>;
};

type PostProps = {
  data: PostData;
};

function Post({ data }: PostProps) {
  const title = data.title || new Date(data.date).toDateString();
  const hasPhotos = data.photos && data.photos.length > 0;
  const hasTags = data.tags && data.tags.length > 0;

  const [deletePost, deletePostState] = useMutation(deletePostMutation);

  const handlePostDelete = (id: Key) => () => {
    deletePost({ variables: { id }, refetchQueries: ['Posts'] });
  };

  return (
    <section className={commonStyles.section}>
      <header className={styles.header}>
        <h3 className={commonStyles.sectionTitle}>{title}</h3>

        <div className={styles.manager}>
          <Link className={styles.editLink} to={`/post/${data._id}/edit`}>
            Редактировать
          </Link>
          {deletePostState.loading ? (
            'Удаление'
          ) : (
            <Button size='s' onClick={handlePostDelete(data._id)}>
              Удалить
            </Button>
          )}
        </div>
      </header>
      {hasPhotos &&
        data.photos.map((photo: PhotoData) => (
          <Photo key={`photo_${photo._id}`} date={data.date} {...photo} />
        ))}

      {hasTags && (
        <div className={styles.tags}>
          <Tags tags={data.tags} />
        </div>
      )}
    </section>
  );
}

export default Post;
