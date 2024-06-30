import { FormEventHandler } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';

const LoginPage = () => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log('submit', e);
  };

  return (
    <form id='login-form' onSubmit={handleSubmit}>
      <Input placeholder='login' name='login' autoComplete='login' />
      <Input
        placeholder='password'
        type='password'
        name='password'
        autoComplete='current-password'
      />
      <Button type='submit'>Войти</Button>
    </form>
  );
};

export default LoginPage;
