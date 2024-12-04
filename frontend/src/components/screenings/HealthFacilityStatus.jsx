import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const HealthFacilityStatus = () => {
    const navigate = useNavigate();

    const headers = ['Name of Health Facility', 'Name of Village', 'No. of Screening Done', 'Name of CHO/ANM', 'Name of ASHA', 'Name of Midori Staff']

    const data = [
        {
            "name_of_health_facility": "Community Health Center A",
            "name_of_village": "Village Alpha",
            "no_of_screening_done": 120,
            "name_of_CHO_ANM": "John Doe",
            "name_of_asha": "Jane Smith",
            "name_of_midori_staff": "Raj Patel"
        },
        {
            "name_of_health_facility": "Primary Health Center B",
            "name_of_village": "Village Beta",
            "no_of_screening_done": 85,
            "name_of_CHO_ANM": "Emily Davis",
            "name_of_asha": "Anita Roy",
            "name_of_midori_staff": "Sara Khan"
        },
        {
            "name_of_health_facility": "Urban Health Center C",
            "name_of_village": "Village Gamma",
            "no_of_screening_done": 150,
            "name_of_CHO_ANM": "Michael Brown",
            "name_of_asha": "Priya Sharma",
            "name_of_midori_staff": "Akira Tanaka"
        },
        {
            "name_of_health_facility": "Sub-District Hospital D",
            "name_of_village": "Village Delta",
            "no_of_screening_done": 200,
            "name_of_CHO_ANM": "Samantha Green",
            "name_of_asha": "Rohini Mehta",
            "name_of_midori_staff": "Liam Nguyen"
        }
    ];

    return (
        <div className="role-container">
            <div className="filters-container">
                <button onClick={() => navigate(-1)} className="filter-button"><FaHome /> Home</button>
                <span style={{ fontSize: '35px' }}>Health Facility Screening Coverage</span>
                <div style={{ opacity: 0 }} className="filter-container"></div>
            </div>
            <div style={{ marginTop: 20 }} className="fm-item-container">
                <table className="fm-item-table">
                    <thead>
                        <tr>
                            {headers.map((th, idx) => {
                                return (
                                    <th key={idx} style={{ backgroundColor: '#217cc070' }}>{th}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{item?.name_of_health_facility || 'Not filled'}</td>
                                    <td>{item?.name_of_village || 'Not filled'}</td>
                                    <td>{item?.no_of_screening_done || 'Not filled'}</td>
                                    <td>{item?.name_of_CHO_ANM || 'Not filled'}</td>
                                    <td>{item?.name_of_midori_staff || '0'}</td>
                                    <td>{item?.name_of_asha || '0'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HealthFacilityStatus