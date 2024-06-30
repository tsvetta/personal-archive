import styles from './index.module.css';

type InputProps = {
  placeholder?: string;
  type?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
};

const Input = (props: InputProps) => {
  return (
    <input
      className={styles.input}
      type={props.type}
      name={props.name}
      id={props.id}
      placeholder={props.placeholder}
      autoComplete={props.autoComplete}
    />
  );
};

export default Input;

Input.defaultProps = {
  placeholder: 'Placeholder',
  type: 'text',
  name: undefined,
  id: undefined,
};
