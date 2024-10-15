import {
  FieldValidation,
  FieldValidationStateType,
} from '../../components/Form/types.js';

export type LoginFormValidationState = {
  username?: FieldValidation;
  password?: FieldValidation;
  isValid?: boolean;
  formError?: string;
};

export type LoginFormData = {
  username: string;
  password: string;
};

export const validateUsername = (username?: string) => {
  if (!username) {
    return {
      state: FieldValidationStateType.ERROR,
      errorMessage: 'Введите имя',
    };
  }

  return {
    state: FieldValidationStateType.SUCCESS,
  };
};

export const validatePassword = (password?: string) => {
  if (!password) {
    return {
      state: FieldValidationStateType.ERROR,
      errorMessage: 'Введите пароль',
    };
  }

  return {
    state: FieldValidationStateType.SUCCESS,
  };
};

export const validateLoginForm = (
  formData: LoginFormData,
  isDefault?: boolean
): LoginFormValidationState => {
  if (isDefault) {
    return {
      isValid: true,
      username: {
        state: FieldValidationStateType.DEFAULT,
      },
      password: {
        state: FieldValidationStateType.DEFAULT,
      },
      formError: undefined,
    };
  }

  const validations: LoginFormValidationState = {
    username: validateUsername(formData.username),
    password: validatePassword(formData.password),
  };

  const isUsernameValid = validations.username?.errorMessage === undefined;
  const isPasswordValid = validations.password?.errorMessage === undefined;
  const isEmptyForm = !formData.username && !formData.password;

  const isValid = isUsernameValid && isPasswordValid && !isEmptyForm;

  return {
    isValid,
    ...validations,
    formError: isEmptyForm ? 'Введите данные' : undefined,
  };
};
