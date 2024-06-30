import { MouseEventHandler, ReactNode } from 'react';

import styles from './index.module.css';

type ButtonProps = {
  type: 'submit' | 'reset' | 'button' | undefined;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Button = (props: ButtonProps) => {
  return (
    <button className={styles.button} type={props.type} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;

Button.defaultProps = {
  text: 'Button',
  type: 'button',
};
