import Styles from "../ModalNewProduct.module.css";

function Select({
  className,
  text,
  name,
  options,
  handleOnChange,
  value,
  atribute,
  labelAttribute,
}) {
  return (
    <div className={Styles.form_control}>
      <label htmlFor={name}>{text}</label>

      <select
        className={className}
        name={name}
        id={name}
        onChange={handleOnChange}
        value={value}
      >
        <option value="">Selecione uma opção</option>

        {Array.isArray(options) &&
          options.map((option) => {
            const isObject = typeof option === "object" && option !== null;

            const optionValue = isObject ? option[atribute] : option;

            const optionLabel =
              isObject && labelAttribute ? option[labelAttribute] : optionValue;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
      </select>
    </div>
  );
}

export default Select;
