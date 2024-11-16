import React, { useEffect, useState } from 'react'
import { getDashboardFilterQuery, getFilterQuery } from '../../utils/helper'
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaHome } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { MdOutlineClose } from "react-icons/md";

const OverViewHeader = ({ queryParams }) => {

    const navigate = useNavigate();

    const filterDefaults = getDashboardFilterQuery(queryParams);

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const [filterData, setFilterData] = useState(filterDefaults)

    const updateValue = (key, value) => setFilterData((prevState) => ({ ...prevState, [key]: value }));

    const applyFilters = () => {
        setShowFilterDropdown((prevState) => !prevState);
        const queryString = getDashboardFilterQuery({ ...filterData, role_type: queryParams?.role_type })
        navigate(`/dashboard-overview?${queryString}`)
    }

    const resetFilters = () => {
        setFilterData(filterDefaults);
        setShowFilterDropdown((prevState) => !prevState);
        const queryString = getDashboardFilterQuery({ role_type: queryParams?.role_type })
        navigate(`/dashboard-overview?${queryString}`)
    }

    useEffect(() => {
        setTimeout(() => {
            setFilterData({
                from_date: queryParams?.from_date || null,
                to_date: queryParams?.to_date,
                search_term: queryParams?.search_term || '',
                skip_count: queryParams?.skip_count || 0,
                page_limit: queryParams?.page_limit || 50,
                village: queryParams?.village || '',
                district: queryParams?.district || '',
                health_facility: queryParams?.health_facility || '',
            })
        }, 1000);
    }, [])

    return (
        <div className="filters-container">
            <button
                onClick={() => {
                    const queryString = getFilterQuery({ role_type: queryParams?.role_type })
                    navigate(`/users?${queryString}`)
                }}
                className="filter-button"
            >
                <FaHome /> Home
            </button>
            <span style={{ fontSize: '35px' }}>Dashboard Overview</span>
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
                                selected={filterData?.from_date ? moment(filterData.from_date, 'YYYY-MM-DD').toDate() : null}
                                onChange={(date) => updateValue('from_date', moment(date).format('YYYY-MM-DD'))}
                                placeholderText="Select From Date"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                        <div className="filter-option">
                            <label>To Date:</label>
                            <DatePicker
                                selected={filterData?.to_date ? moment(filterData?.to_date, 'YYYY-MM-DD').toDate() : null}
                                onChange={(date) => updateValue('to_date', moment(date).format('YYYY-MM-DD'))}
                                placeholderText="Select To Date"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>

                        <div className="filter-option">
                            <label>Search:</label>
                            <input
                                type="text"
                                value={filterData?.search_term}
                                onChange={(e) => updateValue('search_term', e.target.value)}
                                placeholder="Search by name or Aadhar"
                            />
                        </div>

                        <div className="filter-option">
                            <label>District:</label>
                            <input
                                type="text"
                                value={filterData?.district}
                                onChange={(e) => updateValue('district', e.target.value)}
                                placeholder="Search by district"
                            />
                        </div>

                        <div className="filter-option">
                            <label>Village:</label>
                            <input
                                type="text"
                                value={filterData?.village}
                                onChange={(e) => updateValue('village', e.target.value)}
                                placeholder="Search by village"
                            />
                        </div>

                        <div className="filter-option">
                            <label>Health Facility:</label>
                            <input
                                type="text"
                                value={filterData?.health_facility}
                                onChange={(e) => updateValue('health_facility', e.target.value)}
                                placeholder="Search by health facility"
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

export default OverViewHeader