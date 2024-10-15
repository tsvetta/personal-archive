import {
  AccessLevelsEnum,
  CustomDate,
  Photo,
} from '@archive/server/src/apollo/types.js';
import { TagData } from '../../components/Tags/index.js';
import {
  FieldValidation,
  FieldValidationStateType,
} from '../../components/Form/types.js';
import { PhotosValidation } from './field-photos.js';

export type CreatePostFormData = {
  title?: string;
  date?: string | CustomDate;
  photos: Photo[];
  tags: TagData[];
  accessLevel?: AccessLevelsEnum | '';
  text?: string;
};

export type ValidationState = {
  photos: PhotosValidation[];
  tags: FieldValidation;
  accessLevel: FieldValidation;
  formError?: string;
};

// TODO: regexp for url
const validatePhotos = (photos: Photo[]) => {
  return photos.map((photo) =>
    Boolean(photo.file?.fileUrl) || Boolean(photo.src)
      ? { id: photo._id, state: FieldValidationStateType.SUCCESS }
      : {
          id: photo._id,
          state: FieldValidationStateType.ERROR,
          errorMessage: 'Поле не должно быть пустым',
        }
  );
};

const validateAccessLevels = (accessLevel?: AccessLevelsEnum | '') => {
  if (accessLevel === '') {
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

export const validateForm = (
  formData: CreatePostFormData,
  isDefault?: boolean
) => {
  if (isDefault) {
    return {
      isValid: true,
      photos: [],
      tags: {
        state: FieldValidationStateType.DEFAULT,
      },
      accessLevel: {
        state: FieldValidationStateType.DEFAULT,
      },
      formError: undefined,
    };
  }

  const validations: ValidationState = {
    photos: validatePhotos(formData.photos),
    tags: validateTags(formData.tags),
    accessLevel: validateAccessLevels(formData.accessLevel),
  };

  const isPhotosValid =
    validations.photos.find((p) => Boolean(p.errorMessage)) === undefined;
  const isTagsValid = validations.tags.errorMessage === undefined;
  const isAccessLevelsValid =
    validations.accessLevel.errorMessage === undefined;
  const noTextNoPhotos = !formData.text && formData.photos.length === 0;

  const isValid =
    isPhotosValid && isTagsValid && isAccessLevelsValid && !noTextNoPhotos;

  return {
    isValid,
    ...validations,
    formError: noTextNoPhotos
      ? 'Пост должен содержать фото и/или текст'
      : undefined,
  };
};
