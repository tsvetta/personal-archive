import { Photo } from 'packages/server/src/apollo/types.js';
import Gallery from '../post-form/gallery.js';

import styles from './index.module.css';
import { useNavigate } from 'react-router-dom';

const GalleryPage = () => {
  const navigate = useNavigate();

  const hanldePhotoClick = (photo: Photo) => {
    navigate(`/gallery/${photo._id}`, { state: { photo } });
  };

  return (
    <article className='article'>
      <Gallery
        testId='page-gallery'
        photoWrapperClassName={styles.photoWrapper}
        photosWrapperClassName={styles.photosWrapper}
        showOriginals
        onPhotoClick={hanldePhotoClick}
      />
    </article>
  );
};

export default GalleryPage;
