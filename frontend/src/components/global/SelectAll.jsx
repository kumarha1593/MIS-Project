import React, { useState } from 'react'

const SelectAll = ({ label, onChange, hideLabel = false }) => {
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    return (
        <div className='select-all-checkbox'>
            <input
                type="checkbox"
                id="select_all"
                checked={selectAllChecked}
                onChange={(e) => {
                    const isChecked = e.target.checked;
                    setSelectAllChecked(isChecked);
                    onChange(isChecked)
                }}
            />
            {!hideLabel && <label htmlFor="select_all">{label || 'Select All'}</label>}
        </div>
    )
}

export default SelectAll