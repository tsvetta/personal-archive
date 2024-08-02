import { useEffect, useRef, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  getBBCDNPhotos,
  setPhotoPublished,
} from '../../../server/apollo/queries.js';

import Button from '../../components/Button/index.js';

import styles from './index.module.css';

// const createPhotoFolder = (file: any): any => {
//   return (
//     <div className={styles.photoWrapper} key={file.fileUrl}>
//       <img src={file.fileUrl} className={styles.galleryPhoto} />
//     </div>
//   );
//   // if (typeof folderOrFile === 'string') {
//   //   return (
//   //   );
//   // }

//   // if (Array.isArray(folderOrFile)) {
//   //   return folderOrFile.map((f) => createPhotoFolder(f));
//   // }

//   // if (typeof folderOrFile === 'object') {
//   //   return Object.keys(folderOrFile).map((name) => (
//   //     <>
//   //       <p key={name} className={styles.folderTitle}>
//   //         {name}
//   //       </p>
//   //       {createPhotoFolder(folderOrFile[name])}
//   //     </>
//   //   ));
//   // }
// };

const Gallery = () => {
  const [publishPhoto, publishPhotoState] = useMutation(setPhotoPublished);
  const [pagination, setPagination] = useState({ limit: 20, skip: 0 });
  const [loadData, { data, error, loading }] = useLazyQuery(getBBCDNPhotos, {
    variables: { limit: pagination.limit, skip: pagination.skip },
  });
  const [cdnPhotos, setCdnPhotos] = useState(data?.cdnPhotos || []);

  const loadMorePhotos = () => {
    setPagination({ limit: pagination.limit + 20, skip: 0 });
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPhotos = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight, // Прокрутка до самого низа
        behavior: 'smooth', // Используйте 'smooth' для плавной прокрутки
      });
    }
  };

  useEffect(() => {
    loadData().then(() => {
      setTimeout(scrollPhotos, 500);
    });
  }, [pagination, loadData]);

  useEffect(() => {
    if (data && data.cdnPhotos) {
      setCdnPhotos(data.cdnPhotos);
    }
  }, [data]);

  const setPublished = (photoId: string) => () => {
    console.log(photoId);
    publishPhoto({
      variables: { id: photoId },
      refetchQueries: [
        {
          query: getBBCDNPhotos,
          variables: { limit: pagination.limit, skip: pagination.skip },
        },
      ],
    });
  };

  return (
    <div className={styles.gallery}>
      {error && <p>{error.message}</p>}
      <div className={styles.photosWrapper} ref={scrollRef}>
        {cdnPhotos?.map((f: any) => (
          <div className={styles.photoWrapper} key={f.fileUrl}>
            <img src={f.filePreview} className={styles.galleryPhoto} />
            <button
              type='button'
              className={styles.setPublishedButton}
              onClick={setPublished(f._id)}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className={styles.buttonWrapper}>
        <Button onClick={loadMorePhotos} className={styles.loadButton}>
          Загрузить ещё
        </Button>
        {loading && <p>Photos loading...</p>}
      </div>
    </div>
  );
};

export default Gallery;
