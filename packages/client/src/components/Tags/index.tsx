import { Key } from 'react';
import { Link } from 'react-router-dom';
import commonStyles from '../../common.module.css';

export type TagData = {
  _id: Key;
  name: string;
};

export type TagsData = {
  tags: [TagData];
};

function Tags({ tags }: TagsData) {
  return (
    <ul className={commonStyles.tags}>
      {tags.map((tag: TagData) => (
        <li key={`tag_${tag._id}`} className={commonStyles.tag}>
          <Link to={`/tags/${tag._id}`}>{tag.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Tags;
