import commonStyles from "../InputStyles.module.scss";

interface TextInputProps {
  label?: string;
  customClassName?: string;
  errorMessage?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "tel";
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
const TextInput: React.FC<TextInputProps> = ({
  label,
  customClassName,
  errorMessage,
  placeholder,
  type = "password",
  ...props
}) => {
  return (
    <div className={commonStyles["inputWrapper"]}>
      {label && <label className={commonStyles["labelInput"]}>{label}</label>}
     
      <input
        className={commonStyles["textInput"]}
        type={type}
        placeholder={placeholder}
        {...props}
      />
      {errorMessage && (
        <span className={commonStyles["errorMessage"]}>{errorMessage}</span>
      )}
    </div>
  );
};

export default TextInput;
