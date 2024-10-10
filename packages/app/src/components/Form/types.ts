export enum FieldValidationStateType {
  DEFAULT = 'DEFAULT',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type FieldValidation = {
  state: FieldValidationStateType;
  errorMessage?: string;
};
