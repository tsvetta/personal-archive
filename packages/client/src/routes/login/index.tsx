import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useMutation } from '@apollo/client';

import Input from '../../components/Input/index.js';
import Button from '../../components/Button/index.js';

import formStyles from '../../components/Form/index.module.css';
import {
  FieldValidation,
  FieldValidationStateType,
} from '../post-form/form-validation.js';

import { loginUser } from '../../../server/apollo/index.js';

type LoginFormValidationState = {
  nameInput: FieldValidation;
  passwordInput: FieldValidation;
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [validation, validate] = useState<LoginFormValidationState>({
    nameInput: {
      state: FieldValidationStateType.DEFAULT,
    },
    passwordInput: {
      state: FieldValidationStateType.DEFAULT,
    },
  });

  const [submitLogin] = useMutation(loginUser);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    validate({
      nameInput: {
        state: FieldValidationStateType.ERROR,
        errorMessage: '123',
      },
      passwordInput: {
        state: FieldValidationStateType.ERROR,
        errorMessage: '234',
      },
    });

    try {
      const { data } = await submitLogin({
        variables: {
          data: { username: formData.username, password: formData.password },
        },
      });
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
          validation={validation.nameInput}
        />

        <label htmlFor='password'>Password:</label>
        <Input
          placeholder='password'
          type='password'
          name='password'
          autoComplete='current-password'
          onChange={handleChange}
          validation={validation.passwordInput}
        />

        <Button type='submit'>Войти</Button>
      </fieldset>
    </form>
  );
};

export default LoginPage;
