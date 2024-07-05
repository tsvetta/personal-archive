import { Photo, Privacy } from '.';
import { TagData } from '../../components/Tags';

export enum FieldValidationStateType {
  DEFAULT = 'DEFAULT',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type PhotosValidation = {
  id: string;
  state: FieldValidationStateType;
  errorMessage?: string;
};

export type FieldValidation = {
  state: FieldValidationStateType;
  errorMessage?: string;
};

export type ValidationState = {
  photos: PhotosValidation[];
  tags: FieldValidation;
  privacy: FieldValidation;
};

// TODO: regexp for url
const validatePhotos = (photos: Photo[]) => {
  return photos.map((photo) =>
    Boolean(photo.src)
      ? { id: photo.id, state: FieldValidationStateType.SUCCESS }
      : {
          id: photo.id,
          state: FieldValidationStateType.ERROR,
          errorMessage: 'Поле не должно быть пустым',
        }
  );
};

const validatePrivacy = (privacy?: Privacy) => {
  if (!privacy) {
    return {
      state: FieldValidationStateType.ERROR,
      errorMessage: 'Выберите тип доступа',
    };
  }

  return {
    state: FieldValidationStateType.SUCCESS,
  };
};

const validateTags = (tags: TagData[]) => {
  if (tags.length === 0) {
    return {
      state: FieldValidationStateType.ERROR,
      errorMessage: 'Добавьте хотя бы 1 тег',
    };
  }

  return {
    state: FieldValidationStateType.SUCCESS,
  };
};

export const validateForm = (formData: any, isDefault?: boolean) => {
  if (isDefault) {
    return {
      isValid: true,
      photos: [],
      tags: {
        state: FieldValidationStateType.DEFAULT,
      },
      privacy: {
        state: FieldValidationStateType.DEFAULT,
      },
    };
  }

  const validations: ValidationState = {
    photos: validatePhotos(formData.photos),
    tags: validateTags(formData.tags),
    privacy: validatePrivacy(formData.privacy),
  };

  const isPhotosValid =
    validations.photos.find((p) => Boolean(p.errorMessage)) === undefined;
  const isTagsValid = validations.tags.errorMessage === undefined;
  const isPrivacyValid = validations.privacy.errorMessage === undefined;

  const isValid = isPhotosValid && isTagsValid && isPrivacyValid;

  // (Object.keys(validations) as (keyof typeof validations)[])

  return {
    isValid,
    ...validations,
  };
};
