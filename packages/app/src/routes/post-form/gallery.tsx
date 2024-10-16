import { useEffect, useRef, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  getBBCDNPhotos,
  setPhotoPublished,
} from '@archive/app/src/apollo/queries.js';

import Button from '../../components/Button/index.js';
import galleryStyles from '../../components/Gallery/index.module.css';
import { cx } from '../../utils/cx.js';

type GalleryProps = {
  showOriginals: boolean;
  testId?: string;
  className?: string;
  photoWrapperClassName?: string;
  photosWrapperClassName?: string;
  onPhotoClick?: (photo: any) => void;
};

// TODO Toggle to published
const Gallery = (props: GalleryProps) => {
  const [publishPhoto] = useMutation(setPhotoPublished);
  const [pagination, setPagination] = useState({ limit: 20, skip: 0 });
  const [loadData, { data, error, loading }] = useLazyQuery(getBBCDNPhotos, {
    variables: {
      published: false,
      limit: pagination.limit,
      skip: pagination.skip,
    },
  });
  const [cdnPhotos, setCdnPhotos] = useState(data?.cdnPhotos || []);

  const loadMorePhotos = () => {
    setPagination({ limit: pagination.limit + 20, skip: 0 });
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPhotos = () => {
    if (scrollRef.current) {
      typeof scrollRef.current.scrollTo === 'function' &&
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

  const setPublished = (photoId: string) => async () => {
    await publishPhoto({
      variables: { id: photoId },
      refetchQueries: [
        {
          query: getBBCDNPhotos,
          variables: {
            published: false,
            limit: pagination.limit,
            skip: pagination.skip,
          },
        },
      ],
    });
  };

  const handlePhotoClick = (photo: any) => () => {
    props.onPhotoClick && props.onPhotoClick(photo);
  };

  const photosWrapperStyles = cx([
    galleryStyles.photosWrapper,
    props.photosWrapperClassName,
  ]);

  const photoWrapperStyles = cx([
    galleryStyles.photoWrapper,
    props.photoWrapperClassName,
  ]);

  return (
    <div className={props.className} data-testid={props.testId}>
      {error && <p>{error.message}</p>}
      <div
        className={photosWrapperStyles}
        data-testid='gallery-photos-wrapper'
        ref={scrollRef}
      >
        {cdnPhotos?.map((f: any) => (
          <div className={photoWrapperStyles} key={f.fileUrl}>
            <img
              src={props.showOriginals ? f.fileUrl : f.filePreview}
              className={galleryStyles.galleryPhoto}
              onClick={handlePhotoClick(f)}
              title={f.fileUrl}
            />
            <button
              type='button'
              className={galleryStyles.setPublishedButton}
              onClick={setPublished(f._id)}
              title='Hide from list'
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className={galleryStyles.buttonWrapper}>
        <Button
          onClick={loadMorePhotos}
          className={galleryStyles.loadButton}
          testId='gallery-load-more'
        >
          Загрузить ещё
        </Button>
        {loading && <p>Photos loading...</p>}
      </div>
    </div>
  );
};

Gallery.defaultProps = {
  showOriginals: false,
};

export default Gallery;
