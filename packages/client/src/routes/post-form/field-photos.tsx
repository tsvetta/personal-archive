import { ChangeEventHandler, MouseEventHandler } from 'react';

import { cx } from '../../utils/cx';

import Input from '../../components/Input';
import Button from '../../components/Button';

import formStyles from '../../components/Form/index.module.css';
import styles from './index.module.css';

import { PhotosValidation } from './form-validation';
import { Photo } from '../../../server/apollo/types.js';

type FieldPhotosProps = {
  value: Photo[];
  validation: PhotosValidation[];
  onChange: (
    id: string,
    type: 'src' | 'description'
  ) => ChangeEventHandler<HTMLInputElement>;
  onAddPhoto: MouseEventHandler;
  onDeletePhoto: (id: string) => () => void;
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
        const photoId = photo.id || photo._id;
        const validationState = props.validation.find((p) => p.id === photoId);

        return (
          <div key={photoId} className={styles.field}>
            <div className={styles.preview}>
              <img src={photo.src} alt='Preview' />
            </div>
            <div className={styles.fieldInner}>
              <Input
                placeholder='Photo URL'
                type='text'
                name={`photo_${photoId}`}
                onChange={props.onChange(photoId, 'src')}
                value={photo.src}
                validation={validationState}
              />
              <Input
                placeholder='Photo Description'
                type='textarea'
                name={`photo-description_${photoId}`}
                onChange={props.onChange(photoId, 'description')}
                value={photo.description}
              />
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
      >
        +
      </Button>
    </fieldset>
  );
};

FieldPhotos.defaultProps = {
  value: [{ src: undefined, description: undefined }],
};

export default FieldPhotos;
