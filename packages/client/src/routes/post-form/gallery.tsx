import { useQuery } from '@apollo/client';

import { getBBCDNPhotos } from '../../../server/apollo/queries.js';

import styles from './index.module.css';

const createPhotoFolder = (folderOrFile: any): any => {
  console.log(folderOrFile);

  if (typeof folderOrFile === 'string') {
    return (
      <div className={styles.photoWrapper} key={folderOrFile}>
        <img src={folderOrFile} className={styles.galleryPhoto} />
      </div>
    );
  }

  if (Array.isArray(folderOrFile)) {
    return folderOrFile.map((f) => createPhotoFolder(f));
  }

  if (typeof folderOrFile === 'object') {
    return Object.keys(folderOrFile).map((name) => (
      <>
        <p className={styles.folderTitle}>{name}</p>
        {createPhotoFolder(folderOrFile[name])}
      </>
    ));
  }
};

const Gallery = () => {
  const { data, error, loading } = useQuery(getBBCDNPhotos);
  const cdnPhotos = data?.cdnPhotos?.archive?.photos;
  //   console.log(cdnPhotos);

  return (
    <div className={styles.gallery}>
      {loading && <p>Photos loading...</p>}
      {error && <p>{error.message}</p>}

      {cdnPhotos && createPhotoFolder(cdnPhotos)}
    </div>
  );
};

export default Gallery;
