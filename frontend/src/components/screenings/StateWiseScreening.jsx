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

const data = [
    {
        healthFacilities: 117,
        villagesStarted: 42,
        villagesCompleted: 71,
        populationScreened: 11321,
        male: 9191,
        female: 9970
    },
    {
        healthFacilities: 125,
        villagesStarted: 64,
        villagesCompleted: 42,
        populationScreened: 12983,
        male: 4480,
        female: 8734
    },
    {
        healthFacilities: 138,
        villagesStarted: 57,
        villagesCompleted: 38,
        populationScreened: 17918,
        male: 6572,
        female: 4172
    },
];

const summaryData = [
    { disease: 'DM', knownMale: 1591, knownFemale: 2000, suspectedMale: 682, suspectedFemale: 194, referredMale: 991, referredFemale: 848, confirmedMale: '', confirmedFemale: 29 },
    { disease: 'HTN', knownMale: 178, knownFemale: 59, suspectedMale: 510, suspectedFemale: 283, referredMale: 949, referredFemale: 635, confirmedMale: 823, confirmedFemale: '' },
    { disease: 'Oral Cancer', knownMale: 1986, knownFemale: 1215, suspectedMale: 65, suspectedFemale: 161, referredMale: 291, referredFemale: 778, confirmedMale: 21, confirmedFemale: '' },
    { disease: 'Breast Cancer', knownMale: 92, knownFemale: 2, suspectedMale: 146, suspectedFemale: 802, referredMale: 480, referredFemale: 681, confirmedMale: 81, confirmedFemale: 404 },
    { disease: 'Cervical Cancer', knownMale: 242, knownFemale: 579, suspectedMale: 985, suspectedFemale: 909, referredMale: 860, referredFemale: 16, confirmedMale: '', confirmedFemale: 537 },
    { disease: 'CVD', knownMale: 15, knownFemale: 72, suspectedMale: 575, suspectedFemale: 193, referredMale: 512, referredFemale: 49, confirmedMale: 986, confirmedFemale: '' },
    { disease: 'COPD', knownMale: 1493, knownFemale: 1114, suspectedMale: 581, suspectedFemale: 652, referredMale: 878, referredFemale: 26, confirmedMale: 558, confirmedFemale: 535 },
    { disease: 'CKD', knownMale: 1666, knownFemale: 1543, suspectedMale: 322, suspectedFemale: 519, referredMale: 410, referredFemale: 194, confirmedMale: '', confirmedFemale: '' },
    { disease: 'Patients having both DM and HTN', knownMale: 1041, knownFemale: 1582, suspectedMale: 706, suspectedFemale: 708, referredMale: 986, referredFemale: 267, confirmedMale: '', confirmedFemale: 690 },
    { disease: 'Stroke/Post Stroke', knownMale: 1506, knownFemale: 1492, suspectedMale: 704, suspectedFemale: 951, referredMale: 975, referredFemale: 829, confirmedMale: 620, confirmedFemale: 491 },
    { disease: 'BMI > 23', knownMale: 1267, knownFemale: 744, suspectedMale: 973, suspectedFemale: 143, referredMale: 974, referredFemale: 49, confirmedMale: 570, confirmedFemale: '' }
];

const StateWiseScreening = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const headingName = state?.action_type == "district" ? state?.data : 'State'

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
                        {data.map((item, idx) => (
                            <tr key={idx}>
                                {Object.keys(item).map((key, keyIdx) => {
                                    const value = item[key] !== undefined && item[key] !== null ? item[key] : 'Not filled';
                                    return <td key={keyIdx}>{value}</td>;
                                })}
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
                                    <p>27270</p>
                                </div>
                            </td>
                            <td style={{ padding: 0 }}>
                                <div className='age-group'>
                                    <h4>30-39 Years:</h4>
                                    <p>22940</p>
                                </div>
                            </td>
                            <td style={{ padding: 0 }}>
                                <div className='age-group'>
                                    <h4>40-49 Years:</h4>
                                    <p>21131</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: 0 }}>
                                <div className='age-group'>
                                    <h4>50-59 Years:</h4>
                                    <p>15509</p>
                                </div>
                            </td>
                            <td style={{ padding: 0 }}>
                                <div className='age-group'>
                                    <h4>60 years or above:</h4>
                                    <p>18596</p>
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