import { ChangeEventHandler, Key, useRef, useState } from 'react';
import styles from './index.module.css';

import { cx } from '../../utils/cx.js';
import { useOutsideClick } from '../../utils/useClickOutside.js';

import Tags, { TagData } from '../Tags/index.js';
import Input from '../Input/index.js';
import Button from '../Button/index.js';
import { FieldValidation, FieldValidationStateType } from '../Form/types.js';

type InputTagsSuggestProps = {
  name?: string;
  placeholder?: string;
  validation: FieldValidation;
  data: TagData[];
  value: TagData[];
  onTagCreate: (name: string) => void;
  onTagDelete: (id: Key) => void;
  onChange: (clickedTag: TagData) => void;
};

const InputTagsSuggest = (props: InputTagsSuggestProps) => {
  const [input, setInput] = useState('');
  const [isSuggestOpened, toggleSuggest] = useState(false);

  const suggestedData = props.data.filter((tag) => {
    const isInputted = tag.name.includes(input.trim());
    const notInEnteredValues =
      props.value.find((vtag) => vtag._id === tag._id) === undefined;

    return isInputted && notInEnteredValues;
  });

  const handleInputClick = () => {
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

  const handleSelectedTagClick = (clickedTag: TagData) => () => {
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
        validation={props.validation}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onKeyDown={handleInputKeyDown}
      />

      <ul className={suggestionClasses}>
        {suggestedData.length === 0 && (
          <li className={styles.itemEmpty}>Click Space to create a new Tag</li>
        )}

        {suggestedData.map((suggestion) => {
          const hasLinkedPosts = Boolean(suggestion.posts?.length);

          return (
            <li key={suggestion._id} className={styles.item}>
              {hasLinkedPosts ? null : (
                <Button
                  view='danger'
                  size='s'
                  type='button'
                  className={styles.deleteTagButton}
                  onClick={handleDeleteTag(suggestion)}
                >
                  x
                </Button>
              )}
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

      <ul className={styles.selectedTags}>
        <Tags isButtons tags={props.value} onClick={handleSelectedTagClick} />
      </ul>
    </div>
  );
};

export default InputTagsSuggest;

InputTagsSuggest.defaultProps = {
  name: undefined,
  placeholder: 'Placeholder',
  validation: {
    state: FieldValidationStateType.DEFAULT,
  },
  value: '',
  data: [],
  onTagCreate: () => {},
  onChange: () => {},
};
