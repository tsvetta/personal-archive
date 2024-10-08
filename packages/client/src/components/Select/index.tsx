import {
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react';

import { cx } from '../../utils/cx.js';

import formStyles from '../../components/Form/index.module.css';
import inputStyles from '../../components/Input/index.module.css';
import { FieldValidation, FieldValidationStateType } from '../Form/types.js';

export type SelectOption =
  | {
      value: string | number;
      name: string;
    }
  | '';

type SelectProps = {
  options: SelectOption[];
  validation: FieldValidation;
  name?: string;
  id?: string;
  value: string | number;
  testId?: string;
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
    <div className={formStyles.field}>
      <select
        className={selectStyles}
        value={props.value}
        onChange={props.onChange}
        name={props.name}
        id={props.id}
        data-testid={props.testId}
      >
        {props.options.map((option: SelectOption) => {
          return option ? (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ) : (
            <option key='none' />
          );
        })}
      </select>

      {props.validation.state === FieldValidationStateType.ERROR && (
        <span className={inputStyles.errorMessage}>
          {props.validation.errorMessage}
        </span>
      )}
    </div>
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
