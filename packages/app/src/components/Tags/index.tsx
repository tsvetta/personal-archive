import { Key } from 'react';
import { Link } from 'react-router-dom';
import commonStyles from '../../common.module.css';

export type TagData = {
  _id: Key;
  name: string;
  posts?: { _id: Key }[];
};

export type TagsData = {
  tags: TagData[];
  isButtons?: boolean;
  testId?: string;
  onClick: (tag: TagData) => () => void;
};

const Tags = ({ tags, isButtons, testId, onClick }: TagsData) => {
  return (
    <ul className={commonStyles.tags} data-testid={testId}>
      {tags.map((tag: TagData, idx: number) => (
        <li key={`tag_${tag._id}`} className={commonStyles.tag}>
          {isButtons ? (
            <button
              type='button'
              onClick={onClick(tag)}
              className={commonStyles.tagButton}
              data-testid={`tag-button_${idx}`}
            >
              {tag.name}
            </button>
          ) : (
            <Link to={`/tag/${tag._id}`}>{tag.name}</Link>
          )}
        </li>
      ))}
    </ul>
  );
};

Tags.defaultProps = {
  tags: [],
  isButtons: false,
  onClick: () => {},
};

export default Tags;
