import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Input, { InputState } from '../../components/Input';
import Button from '../../components/Button';

import styles from './index.module.css';

const SUBMIT_LOGIN_FORM = gql`
  mutation SubmitLoginForm($input: LoginFormInput!) {
    submitLoginForm(input: $input) {
      success
      message
    }
  }
`;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });

  type ValidationState = {
    nameInput: InputState;
    passwordInput: InputState;
  };

  const [validation, validate] = useState<ValidationState>({
    nameInput: 'default',
    passwordInput: 'default',
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
      nameInput: 'success',
      passwordInput: 'success',
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
    <form id='login-form' onSubmit={handleSubmit} className={styles.form}>
      <fieldset className={styles.fieldset}>
        <legend>Login</legend>

        <div className={styles.field}>
          <label htmlFor='name'>Name:</label>
          <Input
            placeholder='name'
            name='name'
            autoComplete='name'
            onChange={handleChange}
            state={validation.nameInput}
          />
        </div>

        <div className={styles.field}>
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
