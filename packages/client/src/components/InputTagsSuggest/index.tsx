import { ChangeEventHandler, Key, useRef, useState } from 'react';
import styles from './index.module.css';

import { cx } from '../../utils/cx';
import { TagData } from '../Tags';
import Input from '../Input';
import { useOutsideClick } from '../../utils/useClickOutside';
import Button from '../Button';

export enum InputValidationState {
  DEFAULT = 'DEFAULT',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

type InputTagsSuggestProps = {
  name?: string;
  placeholder?: string;
  state: InputValidationState;
  data: TagData[];
  value: TagData[];
  onTagCreate: (name: string) => void;
  onTagDelete: (id: Key) => void;
  onChange: (clickedTag: TagData) => void;
};

const InputTagsSuggest = (props: InputTagsSuggestProps) => {
  const [input, setInput] = useState('');
  const [isSuggestOpened, toggleSuggest] = useState(false);
  const suggestedData = props.data.filter((tag) =>
    tag.name.includes(input.trim())
  );

  const handleClick = () => {
    toggleSuggest(!isSuggestOpened);
  };

  const suggestionClasses = cx([
    styles.suggestions,
    isSuggestOpened && styles.open,
  ]);

  const suggestionRef = useRef(null);
  useOutsideClick(suggestionRef, () => toggleSuggest(false));

  const handleTagClick = (clickedTag: TagData) => () => {
    props.onChange(clickedTag);
  };

  const handleDeleteTag = (clickedTag: TagData) => () => {
    props.onTagDelete(clickedTag._id);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: any) => {
    const approveKeyCode = 32; // space, enter
    const cancelKeyCode = 27; // esc

    if (approveKeyCode === e.keyCode) {
      setInput('');

      props.onTagCreate(input.trim());
    }

    if (cancelKeyCode === e.keyCode) {
      setInput('');
    }
  };

  return (
    <div className={styles.wrapper} ref={suggestionRef}>
      <Input
        type='search'
        value={input}
        name={props.name}
        placeholder={props.placeholder}
        state={props.state}
        onChange={handleInputChange}
        onClick={handleClick}
        onKeyDown={handleInputKeyDown}
      />

      <ul className={suggestionClasses}>
        {suggestedData.map((suggestion) => {
          return (
            <li key={suggestion._id} className={styles.item}>
              <Button
                view='danger'
                size='s'
                type='button'
                className={styles.deleteTagButton}
                onClick={handleDeleteTag(suggestion)}
              >
                x
              </Button>
              <button
                type='button'
                className={styles.suggestionButton}
                onClick={handleTagClick(suggestion)}
              >
                {suggestion.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default InputTagsSuggest;

InputTagsSuggest.defaultProps = {
  name: undefined,
  placeholder: 'Placeholder',
  state: 'default',
  value: '',
  data: [],
  onTagCreate: () => {},
  onChange: () => {},
};
