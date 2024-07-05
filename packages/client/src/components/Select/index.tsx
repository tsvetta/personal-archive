import {
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';

import { cx } from '../../utils/cx';

import {
  FieldValidation,
  FieldValidationStateType,
} from '../../routes/create-post/form-validation';

import inputStyles from '../../components/Input/index.module.css';

export type SelectOption =
  | {
      id: string;
      name: string;
    }
  | undefined;

type SelectProps = {
  options: SelectOption[];
  validation: FieldValidation;
  name?: string;
  id?: string;
  value: string;
  onChange?: ChangeEventHandler;
  onClick?: MouseEventHandler;
  onKeyUp?: KeyboardEventHandler;
  onKeyDown?: KeyboardEventHandler;
};

const Select = (props: SelectProps) => {
  const selectStyles = cx([
    inputStyles.input,
    props.validation.state === FieldValidationStateType.ERROR &&
      inputStyles.error,
    props.validation.state === FieldValidationStateType.SUCCESS &&
      inputStyles.success,
  ]);

  return (
    <select
      className={selectStyles}
      value={props.value}
      onChange={props.onChange}
      name={props.name}
      id={props.id}
    >
      {props.options.map((option: SelectOption) => {
        return option ? (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ) : (
          <option key='none' />
        );
      })}
    </select>
  );
};

Select.defaultProps = {
  options: [],
  validation: {
    state: FieldValidationStateType,
  },
  name: undefined,
  id: undefined,
  value: undefined,
  onChange: () => {},
  onClick: () => {},
  onKeyUp: () => {},
  onKeyDown: () => {},
};

export default Select;
