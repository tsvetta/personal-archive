import { Key } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import Photo from '../Photo/index.js';
import Tags, { TagData } from '../Tags/index.js';
import Button from '../Button/index.js';

import {
  AccessLevelsEnum,
  AccessLevels as AccessLevelsType,
} from '../../../server/apollo/types.js';
import { deletePostMutation } from '../../../server/apollo/queries.js';
import { useAuth } from '../../features/auth/useAuth.js';

import commonStyles from '../../common.module.css';
import styles from './index.module.css';

export type PhotoData = {
  file?: {
    _id: Key;
    fileUrl: string;
    filePreview: string;
  };
  src?: string;
  description?: string;
};

export type PostData = {
  _id: Required<Key>;
  date: Required<Date>;
  tags: [TagData];
  photos: [PhotoData];
  title: string;
  text: [string];
  accessLevel: AccessLevelsType;
};

type PostProps = {
  data: PostData;
};

const AccessLevels = ({ accessLevel }: { accessLevel: AccessLevelsType }) => {
  const accessLevelTextMap = [
    'Всем',
    'Семье и друзьям',
    'Только друзьям',
    'Близким друзьям',
    'Никому',
  ];

  return (
    <div className={styles.accessLevel}>
      Доступ: {accessLevelTextMap[accessLevel]}
    </div>
  );
};

const Post = ({ data }: PostProps) => {
  const { user } = useAuth();
  const date = data.date && new Date(data.date).toLocaleDateString('ru-RU');
  const title = data.title || date;
  const hasPhotos = data.photos && data.photos.length > 0;
  const hasTags = data.tags && data.tags.length > 0;

  const [deletePost, deletePostState] = useMutation(deletePostMutation);

  const handlePostDelete = (id: Key) => () => {
    deletePost({ variables: { id }, refetchQueries: ['Posts'] });
  };

  return (
    <section className={commonStyles.section}>
      <header className={styles.header}>
        {title && <h3 className={commonStyles.sectionTitle}>{title}</h3>}

        {user?.accessLevel === AccessLevelsEnum.TSVETTA && (
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
        )}
      </header>
      {hasPhotos &&
        data.photos.map(
          (photo: PhotoData) =>
            photo && (
              <Photo
                key={`photo_${photo.file?._id || photo.src}`}
                date={data.date}
                description={photo.description}
                src={photo.file?.fileUrl || photo.src}
              />
            )
        )}

      <div className={styles.footer}>
        <AccessLevels accessLevel={data.accessLevel} />

        {hasTags && (
          <div className={styles.tags}>
            <Tags tags={data.tags} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Post;
