import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Input from '../../components/Input';
import Button from '../../components/Button';

import formStyles from '../../components/Form/index.module.css';
import {
  FieldValidation,
  FieldValidationStateType,
} from '../create-post/form-validation';

import { submitLoginForm } from '../../api';

type LoginFormValidationState = {
  nameInput: FieldValidation;
  passwordInput: FieldValidation;
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
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

  const [submitForm] = useMutation(submitLoginForm);

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
      },
      passwordInput: {
        state: FieldValidationStateType.ERROR,
      },
    });

    try {
      console.log(formData);
      const { data } = await submitForm({
        variables: {
          input: { name: formData.name, password: formData.password },
        },
      });
      console.log('try', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form id='login-form' onSubmit={handleSubmit} className={formStyles.form}>
      <fieldset className={formStyles.fieldset}>
        <legend>Login</legend>

        <div className={formStyles.field}>
          <label htmlFor='name'>Name:</label>
          <Input
            placeholder='name'
            name='name'
            autoComplete='name'
            onChange={handleChange}
            validation={validation.nameInput}
          />
        </div>

        <div className={formStyles.field}>
          <label htmlFor='password'>Password:</label>
          <Input
            placeholder='password'
            type='password'
            name='password'
            autoComplete='current-password'
            onChange={handleChange}
            validation={validation.passwordInput}
          />
        </div>
        <Button type='submit'>Войти</Button>
      </fieldset>
    </form>
  );
};

export default LoginPage;
