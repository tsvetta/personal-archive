import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { cx } from '../../utils/cx.js';

import Input from '../../components/Input/index.js';
import Button from '../../components/Button/index.js';
import { FieldValidation } from '../../components/Form/types.js';

import styles from './index.module.css';
import formStyles from '../../components/Form/index.module.css';

import { loginUser as loginUserQuery } from '../../../server/apollo/queries.js';
import { validateLoginForm } from './form-validation.js';
import { useAuth } from '../../features/auth/useAuth.js';

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

const LoginPage = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
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

    if (!preSubmitValidationState.isValid) {
      return;
    }

    try {
      const { data } = await loginUser({
        variables: {
          data: { username: formData.username, password: formData.password },
        },
      });

      // TODO сделать чтобы был просто refetch через graphql?
      refetchUser(data.loginUser._id);
      navigate('/');
    } catch (error: any) {
      setFieldsValidation({ isValid: false, formError: error.message });
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
