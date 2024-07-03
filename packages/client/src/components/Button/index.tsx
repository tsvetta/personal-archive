import { MouseEventHandler, ReactNode } from 'react';

import styles from './index.module.css';
import { cx } from '../../utils/cx';

type ButtonProps = {
  type: 'submit' | 'reset' | 'button' | undefined;
  view?: 'mini';
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Button = (props: ButtonProps) => {
  const classes = cx([
    props.className,
    styles.button,
    props.view === 'mini' && styles.mini,
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
