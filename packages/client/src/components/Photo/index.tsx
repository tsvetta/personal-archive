import { Key } from 'react';
import commonStyles from '../../common.module.css';

export type PhotoData = {
  _id: Required<Key>;
  src: Required<string>;
  date: Required<Date>;
  description?: string;
  title?: string;
  alt?: string;
  width?: number;
};

const Photo = ({ src, description, date, title, alt, width }: PhotoData) => {
  const localDate = new Date(date).toLocaleDateString('ru-RU');
  const titleText = title || localDate;
  const altText = alt || localDate;

  const DEFAULT_WIDTH = 150;

  return (
    <figure className={commonStyles.figure}>
      <img
        src={src}
        alt={altText}
        title={titleText}
        width={width || DEFAULT_WIDTH}
        className={commonStyles.img}
      />
      <figcaption>{description}</figcaption>
    </figure>
  );
};

export default Photo;
