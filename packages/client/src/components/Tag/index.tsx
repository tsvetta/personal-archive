import { Key } from 'react';
import commonStyles from '../../common.module.css';

export type TagData = {
  _id: Required<Key>;
  name: Required<string>;
};

function Tag({ _id, name }: TagData) {
  return (
    <li key={_id} className={commonStyles.tag}>
      <a href={`/tags/${_id}`}>{name}</a>
    </li>
  );
}

export default Tag;
