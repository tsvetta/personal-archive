import { ChangeEventHandler, MouseEventHandler } from 'react';

import { cx } from '../../utils/cx.js';

import Input from '../../components/Input/index.js';
import Button from '../../components/Button/index.js';

import { Photo } from '../../../server/apollo/types.js';

import { PhotosValidation } from './form-validation.js';

import formStyles from '../../components/Form/index.module.css';
import styles from './index.module.css';
import Gallery from './gallery.js';

type FieldPhotosProps = {
  value: Photo[];
  validation: PhotosValidation[];
  showGallery: boolean;
  onChange: (
    id: string,
    type: 'src' | 'description'
  ) => ChangeEventHandler<HTMLInputElement>;
  onAddPhoto: MouseEventHandler;
  onDeletePhoto: (id: string) => () => void;
  onGalleryPhotoClick: (photo: any) => void;
};

const FieldPhotos = (props: FieldPhotosProps) => {
  return (
    <fieldset
      className={cx([
        formStyles.fieldset,
        formStyles.fieldsetInner,
        styles.fieldset,
      ])}
    >
      <legend>Photos:</legend>
      {props.value.map((photo: Photo) => {
        const photoId = photo._id;
        const validationState = props.validation.find((p) => p.id === photoId);

        return (
          <div key={photoId} className={styles.field}>
            <div className={styles.fieldInner}>
              <Input
                placeholder='Photo URL'
                type='text'
                name={`photo_${photoId}`}
                onChange={props.onChange(photoId, 'src')}
                value={photo?.file?.fileUrl || photo.src}
                validation={validationState}
              />
              <Input
                placeholder='Photo Description'
                type='textarea'
                name={`photo-description_${photoId}`}
                onChange={props.onChange(photoId, 'description')}
                value={photo.description}
              />

              <div className={styles.preview}>
                <img
                  src={photo?.file?.fileUrl}
                  alt='Preview'
                  className={styles.previewImage}
                />
              </div>
            </div>
            <Button
              view='danger'
              size='s'
              className={styles.deletePhotoButton}
              onClick={props.onDeletePhoto(photoId)}
            >
              x
            </Button>
          </div>
        );
      })}

      <Button
        size='s'
        className={styles.addPhotoButton}
        onClick={props.onAddPhoto}
        testId={'add-photo-button'}
      >
        +
      </Button>

      {props.showGallery && (
        <Gallery onPhotoClick={props.onGalleryPhotoClick} />
      )}
    </fieldset>
  );
};

FieldPhotos.defaultProps = {
  value: [{ src: undefined, description: undefined }],
  showGallery: false,
};

export default FieldPhotos;
