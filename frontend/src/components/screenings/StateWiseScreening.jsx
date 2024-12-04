import React from 'react';
import { FaHome } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const headers = [
    'Total Health facility where CMHA screening is started',
    'Total Villages where CMHA screening started',
    'Total Villages where annual CMHA screening is completed',
    'Total population screened',
    'Male',
    'Female',
];

const summaryData = [
    { disease: 'DM', knownMale: 848, knownFemale: '', suspectedMale: 932, suspectedFemale: '', referredMale: 875, referredFemale: '', confirmedMale: '', confirmedFemale: '' },
    { disease: 'HTN', knownMale: 1578, knownFemale: '', suspectedMale: 792, suspectedFemale: '', referredMale: 708, referredFemale: '', confirmedMale: '', confirmedFemale: '' },
    { disease: 'Oral Cancer', knownMale: 70, knownFemale: 24, suspectedMale: 24, suspectedFemale: 0, referredMale: 0, referredFemale: 0, confirmedMale: '', confirmedFemale: '' },
    { disease: 'Breast Cancer', knownMale: 6, knownFemale: 0, suspectedMale: 0, suspectedFemale: 0, referredMale: 0, referredFemale: 0, confirmedMale: '', confirmedFemale: '' },
    { disease: 'Cervical Cancer', knownMale: 6, knownFemale: 1, suspectedMale: 1, suspectedFemale: 1, referredMale: 1, referredFemale: 1, confirmedMale: '', confirmedFemale: '' },
    { disease: 'CVD', knownMale: 34, knownFemale: 0, suspectedMale: 0, suspectedFemale: 0, referredMale: 0, referredFemale: 0, confirmedMale: '', confirmedFemale: '' },
    { disease: 'COPD', knownMale: 6, knownFemale: 1, suspectedMale: 1, suspectedFemale: 1, referredMale: 1, referredFemale: 1, confirmedMale: '', confirmedFemale: '' },
    { disease: 'CKD', knownMale: 46, knownFemale: 3, suspectedMale: 3, suspectedFemale: 0, referredMale: 0, referredFemale: 0, confirmedMale: '', confirmedFemale: '' },
    { disease: 'Patients having both DM and HTN', knownMale: 208, knownFemale: '', suspectedMale: '', suspectedFemale: '', referredMale: '', referredFemale: '', confirmedMale: '', confirmedFemale: '' },
    { disease: 'Stroke/Post Stroke', knownMale: 70, knownFemale: '', suspectedMale: '', suspectedFemale: '', referredMale: '', referredFemale: '', confirmedMale: '', confirmedFemale: '' },
    { disease: 'BMI > 23', knownMale: 3975, knownFemale: '', suspectedMale: '', suspectedFemale: '', referredMale: '', referredFemale: '', confirmedMale: '', confirmedFemale: '' },
];

const StateWiseScreening = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const headingName = state?.action_type == "district" ? state?.data : 'State'
    const data = [{}, {}, {}]; // Placeholder for dynamic data.

    return (
        <div className="role-container">
            {/* Header Section */}
            <div className="filters-container">
                <button onClick={() => navigate(-1)} className="filter-button">
                    <FaHome /> Home
                </button>
                <span style={{ fontSize: '35px' }}>{`Screening Coverage (${headingName})`}</span>
                <div style={{ opacity: 0 }} className="filter-container"></div>
            </div>

            {/* Main Screening Table */}
            <div style={{ marginTop: 20 }} className="fm-item-container">
                <table className="fm-item-table">
                    <thead>
                        <tr>
                            {headers.map((header, idx) => (
                                <th key={idx} style={{ backgroundColor: '#217cc070', maxWidth: '200px', whiteSpace: 'break-spaces' }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((_, idx) => (
                            <tr key={idx}>
                                <td>Not filled</td>
                                <td>Not filled</td>
                                <td>Not filled</td>
                                <td>Not filled</td>
                                <td>0</td>
                                <td>0</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Age Group Section */}
            <div style={{ marginTop: 20 }} className="fm-item-container">
                <h3>AGE GROUP :</h3>
                <table className="fm-item-table">
                    <tbody>
                        <tr>
                            <td style={{ padding: 0 }}>
                                <div className='age-group'>
                                    <h4>18-29 Years:</h4>
                                    <p>287848</p>
                                </div>
                            </td>
                            <td style={{ padding: 0 }}>
                                <div className='age-group'>
                                    <h4>30-39 Years:</h4>
                                    <p>37663</p>
                                </div>
                            </td>
                            <td style={{ padding: 0 }}>
                                <div className='age-group'>
                                    <h4>40-49 Years:</h4>
                                    <p>97844</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: 0 }}>
                                <div className='age-group'>
                                    <h4>50-59 Years:</h4>
                                    <p>287848</p>
                                </div>
                            </td>
                            <td style={{ padding: 0 }}>
                                <div className='age-group'>
                                    <h4>60 years or above:</h4>
                                    <p>37663</p>
                                </div>
                            </td>
                            <td style={{ padding: 0 }}>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Summary Section */}
            <h3>{`Summary (${headingName}):`}</h3>
            <div className="summary-table-container">
                <table className="summary-table">
                    <thead>
                        <tr>
                            <th rowSpan="2">DISEASES TYPE</th>
                            <th colSpan="2">Total No. of Known Cases</th>
                            <th colSpan="2">Total No. of Suspected Cases</th>
                            <th colSpan="2">Total No. of Cases Referred for Confirmation</th>
                            <th colSpan="2">Total No. of Newly Confirmed Cases</th>
                        </tr>
                        <tr>
                            <th>Male</th>
                            <th>Female</th>
                            <th>Male</th>
                            <th>Female</th>
                            <th>Male</th>
                            <th>Female</th>
                            <th>Male</th>
                            <th>Female</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaryData.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.disease}</td>
                                <td>{row.knownMale}</td>
                                <td>{row.knownFemale}</td>
                                <td>{row.suspectedMale}</td>
                                <td>{row.suspectedFemale}</td>
                                <td>{row.referredMale}</td>
                                <td>{row.referredFemale}</td>
                                <td>{row.confirmedMale}</td>
                                <td>{row.confirmedFemale}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StateWiseScreening;