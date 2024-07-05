import {
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';

import formStyles from '../../components/Form/index.module.css';
import styles from './index.module.css';

import { cx } from '../../utils/cx';
import {
  FieldValidation,
  FieldValidationStateType,
} from '../../routes/create-post/form-validation';

type InputProps = {
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  name?: string;
  id?: string;
  autoComplete?: string;
  validation: FieldValidation;
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
    props.validation.state === FieldValidationStateType.ERROR && styles.error,
    props.validation.state === FieldValidationStateType.SUCCESS &&
      styles.success,
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

  let inputNode = <input type={props.type} {...inputProps} />;

  if (isTextarea) {
    inputNode = <textarea {...inputProps} />;
  }

  return (
    <div className={formStyles.field}>
      {inputNode}

      {props.validation.state === FieldValidationStateType.ERROR && (
        <span className={styles.errorMessage}>
          {props.validation.errorMessage}
        </span>
      )}
    </div>
  );
};

export default Input;

Input.defaultProps = {
  placeholder: 'Placeholder',
  type: 'text',
  name: undefined,
  id: undefined,
  validation: {
    state: FieldValidationStateType.DEFAULT,
  },
  value: undefined,
  defaultValue: undefined,
  onChange: () => {},
  onClick: () => {},
  onKeyUp: () => {},
  onKeyDown: () => {},
};
