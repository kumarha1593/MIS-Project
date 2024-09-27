import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import { MdOutlineClose } from "react-icons/md";
import { FaFilter } from 'react-icons/fa';
import { getRoleLabel, ROLE_TYPE } from '../../utils/helper';

const Filters = ({ roleType }) => {

    const filterDefaults = {
        from_date: null,
        to_date: null,
        status: 'all',
        search: ''
    }

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const [filterData, setFilterData] = useState(filterDefaults)

    const updateValue = (key, value) => setFilterData((prevState) => ({ ...prevState, [key]: value }));

    const applyFilters = () => {
        setShowFilterDropdown((prevState) => !prevState)
    }

    return (
        <div className="filters-container">
            <span>Welcome Back, {getRoleLabel(roleType || ROLE_TYPE.STATE_COORDINATOR)}</span>
            <div className="filter-container">
                <button onClick={() => setShowFilterDropdown((prevState) => !prevState)} className="filter-button"><FaFilter /> Filter</button>
                {showFilterDropdown && (
                    <div className="filter-dropdown filters">
                        <div onClick={() => setShowFilterDropdown((prevState) => !prevState)} className='close-btn'>
                            <MdOutlineClose />
                        </div>
                        <div className="filter-option">
                            <label>From Date:</label>
                            <DatePicker
                                selected={filterData?.from_date}
                                onChange={(date) => updateValue('from_date', date)}
                                placeholderText="Select From Date"
                            />
                        </div>
                        <div className="filter-option">
                            <label>To Date:</label>
                            <DatePicker
                                selected={filterData?.to_date}
                                onChange={(date) => updateValue('to_date', date)}
                                placeholderText="Select To Date"
                            />
                        </div>
                        <div className="filter-option">
                            <label>Status:</label>
                            <select
                                value={filterData?.status || ""}
                                onChange={(e) => updateValue('status', e.target.value || '')}
                            >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="filter-option">
                            <label>Search:</label>
                            <input
                                type="text"
                                value={filterData?.search}
                                onChange={(e) => updateValue('search', e.target.value)}
                                placeholder="Search by name or Aadhaar"
                            />
                        </div>
                        <div className="filter-actions">
                            <button onClick={applyFilters}>Apply Filters</button>
                            <button
                                onClick={() => {
                                    setFilterData(filterDefaults);
                                    setShowFilterDropdown((prevState) => !prevState)
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Filters