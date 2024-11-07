import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { MdOutlineClose } from "react-icons/md";
import { FaFilter } from 'react-icons/fa';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Filters = ({ queryParams, totalCount, viewingCount }) => {

    const currentDate = moment().format('YYYY-MM-DD')

    const filterDefaults = {
        from_date: currentDate,
        to_date: currentDate,
        status: '1',
        search_term: '',
        page_limit: 20,
        skip_count: 0
    }

    const navigate = useNavigate();

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const [filterData, setFilterData] = useState(filterDefaults)

    const updateValue = (key, value) => setFilterData((prevState) => ({ ...prevState, [key]: value }));

    const applyFilters = () => {
        setShowFilterDropdown((prevState) => !prevState);
        navigate(`/users?role_type=${queryParams?.role_type}&from_date=${filterData?.from_date}&to_date=${filterData?.to_date}&search_term=${filterData?.search_term}&status=${filterData?.status || 1}&page_limit=${filterData?.page_limit || 20}&skip_count=${filterData?.skip_count || 0}`)
    }

    const resetFilters = () => {
        setFilterData(filterDefaults);
        setShowFilterDropdown((prevState) => !prevState);
        navigate(`/users?role_type=${queryParams?.role_type}&from_date=${currentDate}&to_date=${currentDate}&search_term=&page_limit=20&skip_count=0&status=1`)
    }

    useEffect(() => {
        setTimeout(() => {
            setFilterData({
                from_date: queryParams?.from_date || null,
                to_date: queryParams?.to_date,
                status: queryParams?.status || '1',
                search_term: queryParams?.search_term || '',
                skip_count: queryParams?.skip_count || 0,
                page_limit: queryParams?.page_limit || 20,
            })
        }, 1000);
    }, [])

    return (
        <div className="filters-container">
            <span>Welcome Back</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ marginRight: '5px' }}>{`Showing ${viewingCount > totalCount ? totalCount : viewingCount} of ${totalCount} results`}</p>
                <button style={{ padding: '8px 10px' }} onClick={() => navigate(`/screening-count?from_date=${currentDate}&to_date=${currentDate}&search_term=&page_limit=20&skip_count=`)} className="add-user-button">Screening Count</button>
                <button style={{ padding: '8px 10px' }} onClick={() => alert('to be implemented!')} className="add-user-button">Bulk Export</button>
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
                                <label>Status:</label>
                                <select
                                    value={filterData?.status || ""}
                                    onChange={(e) => updateValue('status', e.target.value || '')}
                                >
                                    <option value="all">All</option>
                                    <option value="0">Pending</option>
                                    <option value="1">Completed</option>
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
        </div>
    )
}

export default Filters