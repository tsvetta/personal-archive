import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Input, { InputValidationState } from '../../components/Input';
import Button from '../../components/Button';

import formStyles from '../../components/Form/index.module.css';

const SUBMIT_LOGIN_FORM = gql`
  mutation SubmitLoginForm($input: LoginFormInput!) {
    submitLoginForm(input: $input) {
      success
      message
    }
  }
`;

type ValidationState = {
  nameInput: InputValidationState;
  passwordInput: InputValidationState;
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });

  const [validation, validate] = useState<ValidationState>({
    nameInput: InputValidationState.DEFAULT,
    passwordInput: InputValidationState.DEFAULT,
  });

  const [submitForm] = useMutation(SUBMIT_LOGIN_FORM);

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
      nameInput: InputValidationState.SUCCESS,
      passwordInput: InputValidationState.SUCCESS,
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
            state={validation.nameInput}
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
            state={validation.passwordInput}
          />
        </div>
        <Button type='submit'>Войти</Button>
      </fieldset>
    </form>
  );
};

export default LoginPage;
