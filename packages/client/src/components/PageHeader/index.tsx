import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth.js';
import styles from './index.module.css';

type PageHeaderProps = {
  title: string;
};

function PageHeader({ title }: PageHeaderProps) {
  const { user } = useAuth();

  return (
    <header className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>
        <Link to='/' className={styles.titleLink}>
          {title}
        </Link>
      </h1>
      {user && (
        <div className={styles.user}>
          User: {user.username}, role: {user.role}
        </div>
      )}
      <nav className={styles.pageMenu}>
        <ul className={styles.pageNav}>
          <li className={styles.navItem}>
            <Link to='/login' className={styles.menuLink}>
              Login
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to='/create-post' className={styles.menuLink}>
              Create Post
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default PageHeader;
