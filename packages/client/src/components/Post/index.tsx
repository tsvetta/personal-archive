import { Key, MouseEventHandler } from 'react';
import commonStyles from '../../common.module.css';
import styles from './index.module.css';
import Photo from '../Photo';
import Tag, { TagData } from '../Tag';
import { MutationResult, gql, useMutation } from '@apollo/client';

enum Privacy {
  'ALL',
  'FAMILY',
  'FRIENDS',
  'CLOSE_FRIENDS',
  'TSVETTA',
}

export type PhotoData = {
  _id: Required<Key>;
  src: Required<string>;
  description: [string];
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

const deletePostMutation = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      _id
    }
  }
`;

function Post({ data }: PostProps) {
  console.log(data);
  const title = data.title || new Date(data.date).toDateString();
  const hasPhotos = data.photos && data.photos.length > 0;
  const hasTags = data.tags && data.tags.length > 0;

  const [deletePost, deletePostState] = useMutation(deletePostMutation);

  const onPostDelete = (id: Key) => () => {
    deletePost({ variables: { id }, refetchQueries: ['Posts'] });
  };

  return (
    <section className={commonStyles.section}>
      <header className={styles.header}>
        <h3 className={commonStyles.sectionTitle}>{title}</h3>
        {deletePostState.loading ? (
          'Удаление'
        ) : (
          <button onClick={onPostDelete(data._id)}>Удалить</button>
        )}
      </header>
      {hasPhotos &&
        data.photos.map((photo: PhotoData) => (
          <Photo key={photo._id} date={data.date} {...photo} />
        ))}

      {hasTags && (
        <ul className={commonStyles.tags}>
          {data.tags.map((tag: TagData) => (
            <Tag key={tag._id} {...tag} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default Post;
