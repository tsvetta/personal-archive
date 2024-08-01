import { useQuery } from '@apollo/client';

import { getBBCDNPhotos } from '../../../server/apollo/queries.js';

import styles from './index.module.css';
import { useState } from 'react';

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
  const [nextFileName, setNextFileName] = useState('');
  const { data, error, loading } = useQuery(getBBCDNPhotos, {
    variables: { limit: 20, skip: 0 },
  });
  const cdnPhotos = data?.cdnPhotos;

  return (
    <div className={styles.gallery}>
      {loading && <p>Photos loading...</p>}
      {error && <p>{error.message}</p>}

      {cdnPhotos &&
        cdnPhotos.map((f: any) => (
          <div className={styles.photoWrapper} key={f.fileUrl}>
            <img src={f.fileUrl} className={styles.galleryPhoto} />
          </div>
        ))}
    </div>
  );
};

export default Gallery;
