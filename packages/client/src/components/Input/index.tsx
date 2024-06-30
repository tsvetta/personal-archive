import { ChangeEventHandler } from 'react';
import styles from './index.module.css';

export type InputState = 'default' | 'success' | 'error';

type InputProps = {
  placeholder?: string;
  type?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  state: InputState;
};

const Input = (props: InputProps) => {
  const inputStyles = [
    styles.input,
    props.state === 'error' && styles.error,
    props.state === 'success' && styles.success,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      className={inputStyles}
      type={props.type}
      name={props.name}
      id={props.id}
      placeholder={props.placeholder}
      autoComplete={props.autoComplete}
      onChange={props.onChange}
    />
  );
};

export default Input;

Input.defaultProps = {
  placeholder: 'Placeholder',
  type: 'text',
  name: undefined,
  id: undefined,
  onChange: () => {},
  state: 'default',
};
