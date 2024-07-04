import {
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';

import { cx } from '../../utils/cx';

import { InputValidationState } from '../Input';

import inputStyles from '../../components/Input/index.module.css';

type Option = {
  id: string;
  name: string;
};

type SelectProps = {
  options: Option[];
  state: InputValidationState;
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
    props.state === InputValidationState.ERROR && inputStyles.error,
    props.state === InputValidationState.SUCCESS && inputStyles.success,
  ]);

  return (
    <select
      className={selectStyles}
      value={props.value}
      onChange={props.onChange}
      name={props.name}
      id={props.id}
    >
      {props.options.map((option: Option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

Select.defaultProps = {
  options: [],
  state: 'default',
  name: undefined,
  id: undefined,
  value: undefined,
  onChange: () => {},
  onClick: () => {},
  onKeyUp: () => {},
  onKeyDown: () => {},
};

export default Select;
