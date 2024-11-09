import React, { useState } from 'react';

const SearchableDropdown = ({ label, options, onSelect, placeholder, style = {}, value, labelStyle = {}, inputStyle = {} }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Filter options based on the search term
    const filteredOptions = options?.filter((option) =>
        String(option?.label)?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        String(option?.value)?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setIsOpen(true);
    };

    const handleSelect = (option) => {
        setSearchTerm(`${option?.label} / ${option?.value}`);
        setIsOpen(false);
        onSelect(option);
    };

    useState(() => {
        setSearchTerm(value);
    }, [value])

    return (
        <div style={style} className="dropdown-container">
            {label && <label style={labelStyle} className="dropdown-label">{label}</label>}
            <input
                type="text"
                className="dropdown-input"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setIsOpen(!isOpen)}
                style={inputStyle}
            />
            {isOpen && (
                <ul className="dropdown-menu">
                    {filteredOptions?.length > 0 ? (
                        filteredOptions.map((option) => (
                            <li
                                key={option?.value}
                                className="dropdown-item"
                                onClick={() => handleSelect(option)}
                            >
                                {`${option?.label} / ${option?.value}`}
                            </li>
                        ))
                    ) : (
                        <li className="dropdown-item no-results">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableDropdown;

// Example
// <SearchableDropdown
//    label="Villages"
//    options={villageOptions}
//    onSelect={(data) => { console.log(data) }}
//    placeholder="Select Village"
// />
