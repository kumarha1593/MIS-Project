import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { MdOutlineClose } from "react-icons/md";
import { FaFilter } from 'react-icons/fa';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { getFilterQuery, getScreeningFilterQuery } from '../../utils/helper';

const ScreeningFilter = ({ queryParams }) => {

    const filterDefaults = getScreeningFilterQuery(queryParams)

    const navigate = useNavigate();

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const [filterData, setFilterData] = useState(filterDefaults)

    const updateValue = (key, value) => setFilterData((prevState) => ({ ...prevState, [key]: value }));

    const applyFilters = () => {
        setShowFilterDropdown((prevState) => !prevState);
        const queryString = getScreeningFilterQuery({ ...filterData, role_type: queryParams?.role_type })
        navigate(`/screening-count?${queryString}`)
    }

    const resetFilters = () => {
        setFilterData(filterDefaults);
        setShowFilterDropdown((prevState) => !prevState);
        const queryString = getScreeningFilterQuery({ role_type: queryParams?.role_type })
        navigate(`/screening-count?${queryString}`)
    }

    useEffect(() => {
        setTimeout(() => {
            setFilterData({
                from_date: queryParams?.from_date || null,
                to_date: queryParams?.to_date,
                search_term: queryParams?.search_term || '',
                skip_count: queryParams?.skip_count || 0,
                page_limit: queryParams?.page_limit || 20,
            })
        }, 1000);
    }, [])

    const margin = 20;
    const records = Array.from({ length: 21 }, (_, i) => i * margin);

    return (
        <div className="filters-container">
            <span
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    const queryString = getFilterQuery({ role_type: queryParams?.role_type })
                    navigate(`/users?${queryString}`)
                }}
            >
                Screening Count
            </span>
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
                            <label>No of Records:</label>
                            <select
                                value={filterData?.page_limit || ""}
                                onChange={(e) => updateValue('page_limit', e.target.value || '')}
                            >
                                {records?.map((item, idx) => {
                                    if (item == 0) return
                                    return (
                                        <option key={idx} value={item}>{item}</option>
                                    )
                                })}
                            </select>
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

export default ScreeningFilter