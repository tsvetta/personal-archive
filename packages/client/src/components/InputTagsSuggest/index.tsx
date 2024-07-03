import { ChangeEventHandler, useState } from 'react';
import styles from './index.module.css';

import { cx } from '../../utils/cx';
import { TagData } from '../Tags';
import Input from '../Input';

export enum InputValidationState {
  DEFAULT = 'DEFAULT',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

type InputTagsSuggestProps = {
  name?: string;
  placeholder?: string;
  state: InputValidationState;
  data?: TagData[];
  value: TagData[];
  onChange?: ChangeEventHandler;
};

const InputTagsSuggest = (props: InputTagsSuggestProps) => {
  const [input, setInput] = useState('');

  return (
    <Input
      type='search'
      value={input}
      name={props.name}
      placeholder={props.placeholder}
      state={props.state}
      onChange={props.onChange}
    />
  );
};

export default InputTagsSuggest;

InputTagsSuggest.defaultProps = {
  name: undefined,
  placeholder: 'Placeholder',
  state: 'default',
  value: '',
  data: [],
  onChange: () => {},
};
