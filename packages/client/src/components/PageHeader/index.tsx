import { Link } from 'react-router-dom';
import styles from './index.module.css';

type PageHeaderProps = {
  title: string;
};

function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>{title}</h1>
      <nav className={styles.pageMenu}>
        <ul className={styles.pageNav}>
          <li className={styles.navItem}>
            <Link to='/login'>Login</Link>
          </li>
          <li className={styles.navItem}>
            <Link to='/create-post'>Create Post</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default PageHeader;
