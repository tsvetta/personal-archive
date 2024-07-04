import { InputValidationState } from '../../components/Input';

import { Photo } from '.';

export type PhotosValidation = {
  id: string;
  validationState: InputValidationState;
};

export type ValidationState = {
  photos: PhotosValidation[];
  tags: InputValidationState;
  privacy: InputValidationState;
};

export const validatePhotos = (photos: Photo[]) => {
  return photos.map((photo) =>
    Boolean(photo.src)
      ? { id: photo.id, validationState: InputValidationState.SUCCESS }
      : { id: photo.id, validationState: InputValidationState.ERROR }
  );
};

export const validateForm = (formData: any, isDefault?: boolean) => {
  if (isDefault) {
    return {
      photos: [],
      tags: InputValidationState.DEFAULT,
      privacy: InputValidationState.DEFAULT,
    };
  }

  return {
    photos: validatePhotos(formData.photos),
    tags: InputValidationState.SUCCESS,
    privacy: InputValidationState.SUCCESS,
  };
};
