import { ChangeEventHandler } from 'react';
import styles from './index.module.css';

import { cx } from '../../utils/cx';

export type InputValidationState = 'default' | 'success' | 'error';

type InputProps = {
  placeholder?: string;
  type?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  onChange?: ChangeEventHandler;
  state: InputValidationState;
  value: string;
  defaultValue?: string;
};

const Input = (props: InputProps) => {
  const isTextarea = props.type === 'textarea';
  const inputStyles = [
    styles.input,
    props.state === 'error' && styles.error,
    props.state === 'success' && styles.success,
    isTextarea && styles.textarea,
  ];

  if (isTextarea) {
    return (
      <textarea
        className={cx(inputStyles)}
        name={props.name}
        id={props.id}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        onChange={props.onChange}
        value={props.value}
        defaultValue={props.defaultValue}
      />
    );
  }

  return (
    <input
      className={cx(inputStyles)}
      type={props.type}
      name={props.name}
      id={props.id}
      placeholder={props.placeholder}
      autoComplete={props.autoComplete}
      onChange={props.onChange}
      value={props.value}
      defaultValue={props.defaultValue}
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
  value: undefined,
  defaultValue: undefined,
};
