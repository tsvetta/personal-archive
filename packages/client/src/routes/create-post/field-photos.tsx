import { cx } from '../../utils/cx';

import Input from '../../components/Input';
import Button from '../../components/Button';

import formStyles from '../../components/Form/index.module.css';
import styles from './index.module.css';
import { ChangeEventHandler, MouseEventHandler } from 'react';
import { Photo, PhotosValidation } from '.';

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
    <fieldset className={cx([formStyles.fieldset, formStyles.fieldsetInner])}>
      <legend>Photos:</legend>
      {props.value.map((photo: Photo) => {
        const validationState = props.validation.find(
          (photoValidation) => photoValidation.id === photo.id
        )?.validationState;

        return (
          <div key={photo.id} className={styles.field}>
            <div className={styles.fieldInner}>
              <div className={formStyles.field}>
                <Input
                  placeholder='Photo URL'
                  type='text'
                  name={`photo_${photo.id}`}
                  onChange={props.onChange(photo.id, 'src')}
                  value={photo.src}
                  state={validationState}
                />
              </div>
              <div className={formStyles.field}>
                <Input
                  placeholder='Photo Description'
                  type='textarea'
                  name={`photo-description_${photo.id}`}
                  onChange={props.onChange(photo.id, 'description')}
                  value={photo.description}
                />
              </div>
            </div>
            <Button
              view='danger'
              size='s'
              className={styles.deletePhotoButton}
              onClick={props.onDeletePhoto(photo.id)}
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
