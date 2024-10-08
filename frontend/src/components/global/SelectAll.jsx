import React, { useState } from 'react'

const SelectAll = ({ label, onChange }) => {
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
            <label htmlFor="select_all">{label || 'Select All'}</label>
        </div>
    )
}

export default SelectAll