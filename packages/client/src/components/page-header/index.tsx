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
            <a href='/login'>Login</a>
          </li>
          <li className={styles.navItem}>
            <a href='/create-post'>Create Post</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default PageHeader;
