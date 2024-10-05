import { MouseEventHandler, ReactNode } from 'react';

import styles from './index.module.css';
import { cx } from '../../utils/cx.js';

type ButtonProps = {
  type: 'submit' | 'reset' | 'button' | undefined;
  size?: 's';
  view?: 'danger' | 'link';
  children?: ReactNode;
  className?: string;
  testId?: string;
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Button = (props: ButtonProps) => {
  const classes = cx([
    props.className,
    styles.button,
    props.size === 's' && styles.size_s,
    props.view === 'danger' && styles.view_danger,
    props.view === 'link' && styles.view_link,
  ]);

  return (
    <button
      className={classes}
      type={props.type}
      onClick={props.onClick}
      data-testid={props.testId}
      title={props.title}
    >
      {props.children}
    </button>
  );
};

export default Button;

Button.defaultProps = {
  text: 'Button',
  type: 'button',
};
