import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker';
import { MdOutlineClose } from "react-icons/md";
import { FaFilter } from 'react-icons/fa';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AbhaIdStatus, age, cataract, getFilterQuery, getScreeningFilterQuery, htnOptions, riskScore, sex, yesNoOptions } from '../../utils/helper';
import UploadBulkUser from './UploadBulkUser';

const Filters = ({ queryParams, totalCount, viewingCount, onExport, selectedItem, onEdit, onDone }) => {

    const filterDefaults = getFilterQuery(queryParams);
    const fileInputRef = useRef(null);

    const userData = useRef(null)

    const navigate = useNavigate();

    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filterData, setFilterData] = useState(filterDefaults)

    const updateValue = (key, value) => setFilterData((prevState) => ({ ...prevState, [key]: value }));

    const applyFilters = () => {
        setShowFilterDropdown((prevState) => !prevState);
        const queryString = getFilterQuery({ ...filterData, role_type: queryParams?.role_type })
        navigate(`/users?${queryString}`)
    }

    const resetFilters = () => {
        setFilterData(filterDefaults);
        setShowFilterDropdown((prevState) => !prevState);
        const queryString = getFilterQuery({ role_type: queryParams?.role_type })
        navigate(`/users?${queryString}`)
    }

    useEffect(() => {
        const data = localStorage.getItem('user_data');
        if (data) {
            userData.current = JSON.parse(data);
        }
        setTimeout(() => {
            setFilterData({
                from_date: queryParams?.from_date || null,
                to_date: queryParams?.to_date,
                status: queryParams?.status || '1',
                search_term: queryParams?.search_term || '',
                skip_count: queryParams?.skip_count || 0,
                page_limit: queryParams?.page_limit || 50,
            })
        }, 1000);
    }, []);


    const handleFileChange = (event) => {
        const file = event?.target?.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    return (
        <div className="filters-container">
            <span>Welcome Back, {userData?.current?.name || ''}</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ marginRight: '5px' }}>{`Showing ${viewingCount > totalCount ? totalCount : viewingCount} of ${totalCount} results`}</p>
                {selectedItem
                    ?
                    <button
                        style={{ padding: '8px 10px' }}
                        onClick={onEdit}
                        className="add-user-button"
                    >
                        Edit
                    </button>
                    :
                    null
                }
                <button
                    onClick={() => fileInputRef?.current?.click()}
                    className="add-user-button"
                    style={{ padding: '8px 10px' }}
                >
                    Bulk Import
                </button>
                <input
                    id='image_id'
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
                <button
                    style={{ padding: '8px 10px' }}
                    onClick={() => {
                        const queryString = getScreeningFilterQuery({ role_type: queryParams?.role_type })
                        navigate(`/screening-count?${queryString}`)
                    }}
                    className="add-user-button"
                >
                    Screening Count
                </button>
                <button style={{ padding: '8px 10px' }} onClick={onExport} className="add-user-button">Bulk Export</button>
                <div className="filter-container">
                    <button onClick={() => setShowFilterDropdown((prevState) => !prevState)} className="filter-button"><FaFilter /> Filter</button>
                    {showFilterDropdown && (
                        <div style={{ height: '400px', overflowY: 'scroll' }} className="filter-dropdown filters">
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

                            <div className="filter-option">
                                <label>Risk Score:</label>
                                <select
                                    value={filterData?.risk_score || ""}
                                    onChange={(e) => updateValue('risk_score', e.target.value || '')}
                                >
                                    {riskScore.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>HTN:</label>
                                <select
                                    value={filterData?.case_of_htn || ""}
                                    onChange={(e) => updateValue('case_of_htn', e.target.value || '')}
                                >
                                    {htnOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>DM:</label>
                                <select
                                    value={filterData?.case_of_dm || ""}
                                    onChange={(e) => updateValue('case_of_dm', e.target.value || '')}
                                >
                                    {htnOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>Oral Cancer:</label>
                                <select
                                    value={filterData?.suspected_oral_cancer || ""}
                                    onChange={(e) => updateValue('suspected_oral_cancer', e.target.value || '')}
                                >
                                    {htnOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>Breast Cancer:</label>
                                <select
                                    value={filterData?.suspected_breast_cancer || ""}
                                    onChange={(e) => updateValue('suspected_breast_cancer', e.target.value || '')}
                                >
                                    {htnOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>Cervical Cancer:</label>
                                <select
                                    value={filterData?.cervical_cancer || ""}
                                    onChange={(e) => updateValue('cervical_cancer', e.target.value || '')}
                                >
                                    {htnOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>CVD Cancer:</label>
                                <select
                                    value={filterData?.known_cvd || ""}
                                    onChange={(e) => updateValue('known_cvd', e.target.value || '')}
                                >
                                    {htnOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>History Of Stroke:</label>
                                <select
                                    value={filterData?.history_of_stroke || ""}
                                    onChange={(e) => updateValue('history_of_stroke', e.target.value || '')}
                                >
                                    {yesNoOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>CKD:</label>
                                <select
                                    value={filterData?.known_ckd || ""}
                                    onChange={(e) => updateValue('known_ckd', e.target.value || '')}
                                >
                                    {htnOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>Cataract:</label>
                                <select
                                    value={filterData?.cataract_assessment_result || ""}
                                    onChange={(e) => updateValue('cataract_assessment_result', e.target.value || '')}
                                >
                                    {cataract.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>Hearing:</label>
                                <select
                                    value={filterData?.difficulty_hearing || ""}
                                    onChange={(e) => updateValue('difficulty_hearing', e.target.value || '')}
                                >
                                    {yesNoOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>Leprosy:</label>
                                <select
                                    value={filterData?.leprosy || ""}
                                    onChange={(e) => updateValue('leprosy', e.target.value || '')}
                                >
                                    {yesNoOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>Abha ID:</label>
                                <select
                                    value={filterData?.abhaid_status || ""}
                                    onChange={(e) => updateValue('abhaid_status', e.target.value || '')}
                                >
                                    {AbhaIdStatus.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>Sex:</label>
                                <select
                                    value={filterData?.sex || ""}
                                    onChange={(e) => updateValue('sex', e.target.value || '')}
                                >
                                    {sex.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>Age:</label>
                                <select
                                    value={filterData?.age || ""}
                                    onChange={(e) => updateValue('age', e.target.value || '')}
                                >
                                    {age.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="filter-option">
                                <label>Alcohol Consumption:</label>
                                <select
                                    value={filterData?.alcohol_use || ""}
                                    onChange={(e) => updateValue('alcohol_use', e.target.value || '')}
                                >
                                    {yesNoOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="filter-option">
                                <label>Disability:</label>
                                <select
                                    value={filterData?.disability || ""}
                                    onChange={(e) => updateValue('disability', e.target.value || '')}
                                >
                                    {yesNoOptions.map((option, idx) => {
                                        return (
                                            <option key={idx} value={option?.value}>{option?.label}</option>
                                        )
                                    })}
                                </select>
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
            <UploadBulkUser
                visible={selectedFile ? true : false}
                onDismiss={() => {
                    setSelectedFile(null);
                    const imageElement = document.getElementById("image_id");
                    if (imageElement) {
                        imageElement.textContent = "";
                    }
                }}
                onDone={() => {
                    setSelectedFile(null)
                    onDone()
                }}
                selectedFile={selectedFile}
            />
        </div>
    )
}

export default Filters