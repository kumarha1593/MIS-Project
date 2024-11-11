import React, { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../../utils/apiEndPoints';
import defaultInstance from '../../axiosHelper';
import { useLocation } from 'react-router-dom';
import ScreeningFilter from './ScreeningFilter';

const ScreeningCount = () => {

    const location = useLocation();

    const queryParams = Object.fromEntries(new URLSearchParams(location?.search));

    const [allData, setAllData] = useState([]);
    const [todayScreenings, setTodayScreenings] = useState(0);
    const [totalScreeningsTillDate, setTotalScreeningsTillDate] = useState(0);

    const fetchScreeningReport = async () => {

        const { from_date, to_date, search_term, page_limit = 400, skip_count = 0 } = queryParams || {};

        const params = { from_date, to_date, search_term, page_limit, skip_count: skip_count || '0' }

        const response = await defaultInstance.get(API_ENDPOINTS.SCREENING_REPORT, { params });

        if (response?.data?.success) {
            setAllData(response?.data?.data?.length > 0 ? response?.data?.data : []);
            setTodayScreenings(response?.data?.today_screenings || 0)
            setTotalScreeningsTillDate(response?.data?.total_screenings_till_date || 0)
        }
    }

    useEffect(() => {
        fetchScreeningReport();
    }, [JSON.stringify(queryParams)])

    const headers = ['Field Coordinator Name', 'District', 'Village', 'Health Facility', 'Screen Count']
    const countHeaders = ['Total Screening', 'Today Screening']

    return (
        <div className="role-container">
            <ScreeningFilter queryParams={queryParams} />
            <div style={{ marginTop: 40 }} className="fm-item-container">
                <table className="fm-item-table">
                    <thead>
                        <tr>
                            {countHeaders.map((countTh, idx) => {
                                return (
                                    <th key={idx} style={{ backgroundColor: '#217cc070' }}>{countTh}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontSize: '20px', fontWeight: 700 }}>{totalScreeningsTillDate}</td>
                            <td style={{ fontSize: '20px', fontWeight: 700 }}>{todayScreenings}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: 40 }} className="fm-item-container">
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
                        {allData?.map((item, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{item?.field_coordinator_name || 'Not filled'}</td>
                                    <td>{item?.district || 'Not filled'}</td>
                                    <td>{item?.village || 'Not filled'}</td>
                                    <td>{item?.health_facility || 'Not filled'}</td>
                                    <td>{item?.screen_count || '0'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ScreeningCount