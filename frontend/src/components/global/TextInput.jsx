import React from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const TextInput = ({ label, type = 'text', name, value, onChange, error, required = false, isPassword = false, toggleEyeIcon }) => {
    return (
        <div className='form-group'>
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={error ? 'input-error' : ''}
                autoComplete='off'
            />
            {isPassword &&
                <div className='password-eye' onClick={toggleEyeIcon}>
                    {type === 'text' ? <FaEye /> : <FaEyeSlash />}
                </div>
            }
            {error && <span className="error">{error}</span>}
        </div>
    );
};

TextInput.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    required: PropTypes.bool,
};

export default TextInput;
