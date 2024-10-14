import { Key } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import Photo from '../Photo/index.js';
import Tags, { TagData } from '../Tags/index.js';
import Button from '../Button/index.js';

import { cx } from '../../utils/cx.js';
import {
  AccessLevelsEnum,
  AccessLevels as AccessLevelsType,
} from '@archive/server/src/apollo/types.js';
import { deletePostMutation } from '@archive/app/src/apollo/queries.js';
import { useAuth } from '../../features/auth/useAuth.js';

import commonStyles from '../../common.module.css';
import styles from './index.module.css';

export type PhotoData = {
  _id: Key;
  file?: {
    _id: Key;
    fileUrl: string;
    filePreview?: string;
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
  noLink: boolean;
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

const Post = ({ data, noLink }: PostProps) => {
  const { user } = useAuth();
  const date = data.date && new Date(data.date).toLocaleDateString('ru-RU');
  const hasPhotos = data.photos && data.photos.length > 0;
  const hasTags = data.tags && data.tags.length > 0;
  const isAdmin = user?.accessLevel === AccessLevelsEnum.TSVETTA;
  const showFooterInfo = isAdmin || date;

  const [deletePost, deletePostState] = useMutation(deletePostMutation);

  const handlePostDelete = (id: Key) => () => {
    deletePost({ variables: { id }, refetchQueries: ['Posts'] });
  };

  const headerClasses = cx([
    styles.header,
    isAdmin && !data.title && styles.noTitle,
  ]);

  const content = (
    <section className={commonStyles.section}>
      <header className={headerClasses}>
        {data.title && (
          <h3 className={commonStyles.sectionTitle}>{data.title}</h3>
        )}

        {isAdmin && (
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
                key={`photo_${photo._id || photo.src}`}
                date={data.date}
                description={photo.description}
                src={photo.file?.fileUrl || photo.src}
              />
            )
        )}

      {data.text && (
        <p
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></p>
      )}

      <div className={styles.footer}>
        {showFooterInfo && (
          <div className={styles.footerLeft}>
            {date && <div className={styles.date}>{date}</div>}
            {isAdmin && <AccessLevels accessLevel={data.accessLevel} />}
          </div>
        )}

        {hasTags && (
          <div className={styles.tags}>
            <Tags tags={data.tags} />
          </div>
        )}
      </div>
    </section>
  );

  if (noLink) {
    return content;
  }

  return (
    <Link to={`/post/${data._id}`} className={styles.postLink}>
      {content}
    </Link>
  );
};

Post.defaultProps = {
  noLink: false,
};

export default Post;
