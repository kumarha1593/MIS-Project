import React from 'react';
import PropTypes from 'prop-types';

const SelectInput = ({
    label,
    name,
    value,
    options,
    onChange,
    required = false,
    error,
    placeholder,
    style = {},
    hideLabel = false,
}) => {

    return (
        <div style={style} className='form-group'>
            <label htmlFor={name}>{label}</label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={error ? 'input-error' : ''}
            >
                {!hideLabel ? <option value="">Select {label || placeholder}</option> : null}
                {options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className='error'>{error}</span>}
        </div>
    );
};

SelectInput.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    error: PropTypes.string,
};

export default SelectInput;
