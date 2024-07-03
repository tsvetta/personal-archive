import {
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';
import styles from './index.module.css';

import { cx } from '../../utils/cx';

export enum InputValidationState {
  DEFAULT = 'DEFAULT',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

type InputProps = {
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  name?: string;
  id?: string;
  autoComplete?: string;
  state: InputValidationState;
  value: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler;
  onClick?: MouseEventHandler;
  onKeyUp?: KeyboardEventHandler;
  onKeyDown?: KeyboardEventHandler;
};

const Input = (props: InputProps) => {
  const isTextarea = props.type === 'textarea';
  const inputStyles = [
    styles.input,
    props.state === InputValidationState.ERROR && styles.error,
    props.state === InputValidationState.SUCCESS && styles.success,
    isTextarea && styles.textarea,
  ];

  const inputProps = {
    className: cx(inputStyles),
    name: props.name,
    id: props.id,
    placeholder: props.placeholder,
    autoComplete: props.autoComplete,
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onChange,
    onClick: props.onClick,
    onKeyUp: props.onKeyUp,
    onKeyDown: props.onKeyDown,
  };

  if (isTextarea) {
    return <textarea {...inputProps} />;
  }

  return <input type={props.type} {...inputProps} />;
};

export default Input;

Input.defaultProps = {
  placeholder: 'Placeholder',
  type: 'text',
  name: undefined,
  id: undefined,
  state: 'default',
  value: undefined,
  defaultValue: undefined,
  onChange: () => {},
  onClick: () => {},
  onKeyUp: () => {},
  onKeyDown: () => {},
};
