import { InputValidationState } from '../../components/Input';

export type PhotosValidation = {
  id: string;
  validationState: InputValidationState;
};

export type ValidationState = {
  title: InputValidationState;
  date: InputValidationState;
  photos: PhotosValidation[];
  tags: InputValidationState;
  privacy: InputValidationState;
  text: InputValidationState;
};
