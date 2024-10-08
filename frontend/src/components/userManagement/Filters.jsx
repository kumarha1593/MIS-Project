import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { MdOutlineClose } from "react-icons/md";
import { FaFilter } from 'react-icons/fa';
import { getRoleLabel, ROLE_TYPE } from '../../utils/helper';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Filters = ({ queryParams }) => {

    const currentDate = moment().format('YYYY-MM-DD')

    const filterDefaults = {
        start_date: currentDate,
        end_date: currentDate,
        status: 'all',
        search: ''
    }

    const navigate = useNavigate();

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const [filterData, setFilterData] = useState(filterDefaults)

    const updateValue = (key, value) => setFilterData((prevState) => ({ ...prevState, [key]: value }));

    const applyFilters = () => {
        setShowFilterDropdown((prevState) => !prevState);
        navigate(`/users?role_type=${queryParams?.role_type}&start_date=${filterData?.start_date}&end_date=${filterData?.end_date}&search=${filterData?.search}&status=${filterData?.status}`)
    }

    const resetFilters = () => {
        setFilterData(filterDefaults);
        setShowFilterDropdown((prevState) => !prevState);
        navigate(`/users?role_type=${queryParams?.role_type}&start_date=${currentDate}&end_date=${currentDate}&search=&status=`)
    }

    useEffect(() => {
        setTimeout(() => {
            setFilterData({
                start_date: queryParams?.start_date || null,
                end_date: queryParams?.end_date,
                status: queryParams?.status || 'all',
                search: queryParams?.search || ''
            })
        }, 1000);
    }, [])

    return (
        <div className="filters-container">
            <span>Welcome Back, {getRoleLabel(queryParams?.role_type || ROLE_TYPE.STATE_COORDINATOR)}</span>
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
                                selected={filterData?.start_date ? moment(filterData.start_date, 'YYYY-MM-DD').toDate() : null}
                                onChange={(date) => updateValue('start_date', moment(date).format('YYYY-MM-DD'))}
                                placeholderText="Select From Date"
                            />
                        </div>
                        <div className="filter-option">
                            <label>To Date:</label>
                            <DatePicker
                                selected={filterData?.end_date ? moment(filterData?.end_date, 'YYYY-MM-DD').toDate() : null}
                                onChange={(date) => updateValue('end_date', moment(date).format('YYYY-MM-DD'))}
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
                                <option value="0">Active</option>
                                <option value="1">InActive</option>
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
                            <button onClick={resetFilters}>
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