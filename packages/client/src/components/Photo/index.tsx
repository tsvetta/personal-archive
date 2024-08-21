import styles from './index.module.css';
import commonStyles from '../../common.module.css';

export type PhotoData = {
  src?: string;
  date?: Date;
  description?: string;
  title?: string;
  alt?: string;
  width?: number;
};

const Photo = ({ src, description, date, title, alt, width }: PhotoData) => {
  const localDate = date && new Date(date).toLocaleDateString('ru-RU');
  const titleText = title || localDate;
  const altText = alt || localDate;

  const DEFAULT_WIDTH = 400;

  return (
    <figure className={styles.figure}>
      <img
        src={src}
        alt={altText}
        title={titleText}
        width={width || DEFAULT_WIDTH}
        className={commonStyles.img}
      />
      {description && (
        <figcaption
          className={styles.imgDescription}
          dangerouslySetInnerHTML={{ __html: description }}
        ></figcaption>
      )}
    </figure>
  );
};

export default Photo;
