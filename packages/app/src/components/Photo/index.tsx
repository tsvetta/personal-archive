import styles from './index.module.css';
import commonStyles from '../../common.module.css';

export type PhotoData = {
  src?: string;
  description?: string;
  title?: string;
  alt?: string;
  width?: number;
};

const Photo = ({ src, description, title, alt, width }: PhotoData) => {
  const DEFAULT_WIDTH = 400;

  return (
    <figure className={styles.figure}>
      <img
        src={src}
        alt={alt}
        title={title}
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
