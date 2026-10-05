import Styles from '../ModalNewProduct.module.css';

function Select({
    className,
    text,
    name,
    options,
    handleOnChange,
    value,
    atribute
}) {
    return (
        <div className={Styles.form_control}>
            <label htmlFor={name}>{text}:</label>

            <select
                className={className}
                name={name}
                id={name}
                onChange={handleOnChange}
                value={value}
            >
                <option value="">Selecione uma opção</option>

                {Array.isArray(options) && options.map((option) => (
                    <option
                        value={option[atribute]}
                        key={option[atribute]}
                    >
                        {option[atribute]}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;