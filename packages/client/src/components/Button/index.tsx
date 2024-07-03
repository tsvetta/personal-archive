import { MouseEventHandler, ReactNode } from 'react';

import styles from './index.module.css';
import { cx } from '../../utils/cx';

type ButtonProps = {
  type: 'submit' | 'reset' | 'button' | undefined;
  size?: 's';
  view?: 'danger';
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Button = (props: ButtonProps) => {
  const classes = cx([
    props.className,
    styles.button,
    props.size === 's' && styles.size_s,
    props.view === 'danger' && styles.view_danger,
  ]);

  return (
    <button className={classes} type={props.type} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;

Button.defaultProps = {
  text: 'Button',
  type: 'button',
};
