import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useMutation } from '@apollo/client';

import { cx } from '../../utils/cx.js';

import Input from '../../components/Input/index.js';
import Button from '../../components/Button/index.js';
import { FieldValidation } from '../../components/Form/types.js';

import styles from './index.module.css';
import formStyles from '../../components/Form/index.module.css';

import { loginUser as loginUserQuery } from '../../../server/apollo/queries.js';
import { validateLoginForm } from './form-validation.js';

export type LoginFormValidationState = {
  username: FieldValidation;
  password: FieldValidation;
  isValid?: boolean;
  formError?: string;
};

export type LoginFormData = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const [fieldsValidation, setFieldsValidation] =
    useState<LoginFormValidationState>(validateLoginForm(formData, true));

  const [loginUser] = useMutation(loginUserQuery);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const preSubmitValidationState = validateLoginForm(formData);
    setFieldsValidation(preSubmitValidationState);

    try {
      if (!preSubmitValidationState.isValid) {
        throw new Error('Login: Validation fail!');
      }

      await loginUser({
        variables: {
          data: { username: formData.username, password: formData.password },
        },
      });

      // TODO: разобраться, как обновлять AuthProvider после успешного логина
      location.href = '/';
    } catch (error: any) {
      console.error('Error submitting form:', error.message);
    }
  };

  return (
    <form id='login-form' onSubmit={handleSubmit} className={formStyles.form}>
      <fieldset className={formStyles.fieldset}>
        <legend>Login</legend>
        <label htmlFor='username'>Name:</label>
        <Input
          placeholder='username'
          name='username'
          autoComplete='name'
          onChange={handleChange}
          validation={fieldsValidation.username}
        />

        <label htmlFor='password'>Password:</label>
        <Input
          placeholder='password'
          type='password'
          name='password'
          autoComplete='current-password'
          onChange={handleChange}
          validation={fieldsValidation.password}
        />

        <Button type='submit' className={styles.submitFormButton}>
          Войти
        </Button>

        {fieldsValidation.formError && (
          <span className={cx([formStyles.errorMessage, styles.errorMessage])}>
            {fieldsValidation.formError}
          </span>
        )}
      </fieldset>
    </form>
  );
};

export default LoginPage;
