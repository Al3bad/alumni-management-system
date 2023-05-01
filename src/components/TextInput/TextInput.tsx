import { useField } from "formik";
import "./TextInput.scss";

function TextInput({ label, ...props }: any) {
  const [field, meta] = useField(props);
  return (
    <div className="text-input">
      <label className="text-input__label" htmlFor={props.id || props.name}>
        {label}
      </label>
      <input
        className="text-input__input"
        id={props.id || props.name}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-input__error">{meta.error}</div>
      ) : null}
    </div>
  );
}

export default TextInput;
