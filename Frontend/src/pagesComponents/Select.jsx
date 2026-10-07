import Styles from '../pages_css/NewProduct.module.css';

function Select({
    className,
    text,
    name,
    options = [],
    handleOnChange,
    value
}) {
    return (
        <div className={Styles.form_control}>
            <select
                className={className}
                name={name}
                id={name}
                onChange={handleOnChange}
                value={value}
            >
                <option value="">{text}</option>

                {options.map((option, index) => {
                    // Quando a opção é uma string
                    if (typeof option === 'string') {
                        return (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        );
                    }

                    // Quando a opção é um objeto
                    return (
                        <option value={option.id} key={option.id || index}>
                            {option.medida}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

export default Select;