import { cx } from '../../utils/cx';

import Input, { InputValidationState } from '../../components/Input';
import Button from '../../components/Button';

import formStyles from '../../components/Form/index.module.css';
import styles from './index.module.css';
import { ChangeEventHandler, MouseEventHandler } from 'react';
import { Photo } from '.';

// type ValidationState = {
//   photos: InputValidationState;
// };

type FieldPhotosProps = {
  value: Photo[];
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
                  //   state={validation.photos}
                />
              </div>
              <div className={formStyles.field}>
                <Input
                  placeholder='Photo Description'
                  type='textarea'
                  name={`photo-description_${photo.id}`}
                  onChange={props.onChange(photo.id, 'description')}
                  value={photo.description}
                  //   state={validation.photos}
                />
              </div>
            </div>
            <Button
              view='mini'
              className={styles.deletePhotoButton}
              onClick={props.onDeletePhoto(photo.id)}
            >
              x
            </Button>
          </div>
        );
      })}

      <Button
        view='mini'
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
