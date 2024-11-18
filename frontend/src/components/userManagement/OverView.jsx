import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OverViewHeader from './OverViewHeader';
import OverviewCard from './OverviewCard';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = [
    { background: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },
    { background: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },
    { background: 'rgba(255, 206, 86, 0.6)', border: 'rgba(255, 206, 86, 1)' },
    { background: 'rgba(75, 192, 192, 0.6)', border: 'rgba(75, 192, 192, 1)' },
    { background: 'rgba(153, 102, 255, 0.6)', border: 'rgba(153, 102, 255, 1)' },
    { background: 'rgba(255, 159, 64, 0.6)', border: 'rgba(255, 159, 64, 1)' },
    { background: 'rgba(199, 199, 199, 0.6)', border: 'rgba(199, 199, 199, 1)' },
    { background: 'rgba(83, 102, 255, 0.6)', border: 'rgba(83, 102, 255, 1)' },
];

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: 'Districts Screening' },
    },
    scales: {
        x: {
            title: { display: true, text: 'Districts Name' },
            grid: { display: false },
        },
        y: {
            beginAtZero: true,
            title: { display: true, text: 'Data Captured' },
        },
    },
};

const CARD_CONFIG = [
    {
        title: 'DM Known Case',
        colorIndex: 0,
        fields: [
            { label: 'On treatment: ', key: 'dm_on_treatment_count' },
            { label: 'Not on treatment: ', key: 'dm_not_on_treatment_count' },
        ],
    },
    {
        title: 'HTN Known Case',
        colorIndex: 5,
        fields: [
            { label: 'On treatment: ', key: 'htn_on_treatment_count' },
            { label: 'Not on treatment: ', key: 'htn_not_on_treatment_count' },
        ],
    },
    {
        title: 'DM/HTN Known Case',
        colorIndex: 1,
        fields: [{ label: 'Total: ', key: 'dm_htn_count' }],
    },
    {
        title: 'Health Facility',
        colorIndex: 3,
        fields: [{ label: 'Health Facility: ', key: 'health_facility_count' }],
    },
    {
        title: 'Risk Assessments',
        colorIndex: 7,
        fields: [
            { label: 'Not at risk: ', key: 'not_at_risk_count' },
            { label: 'At risk: ', key: 'at_risk_count' },
        ],
    },
    {
        title: 'Sex',
        colorIndex: 4,
        fields: [
            { label: 'Male: ', key: 'male_count' },
            { label: 'Female: ', key: 'female_count' },
        ],
    },
];

const containerStyle = { marginTop: 40 };
const chartContainerStyle = { marginTop: 50 };

const OverView = () => {
    const location = useLocation();
    const queryParams = Object.fromEntries(new URLSearchParams(location?.search));

    const [ageGroups, setAgeGroups] = useState([]);
    const [districtChartData, setDistrictChartData] = useState(null);
    const [counts, setCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchCounts = async () => {
        try {
            setIsLoading(true)
            const { data } = await defaultInstance.get(API_ENDPOINTS.COUNT_SUMMARY);
            setIsLoading(false)
            if (data?.success) {
                setCounts({
                    dm_not_on_treatment_count: data?.dm_not_on_treatment_count || 0,
                    dm_on_treatment_count: data?.dm_on_treatment_count || 0,
                    htn_not_on_treatment_count: data?.htn_not_on_treatment_count || 0,
                    htn_on_treatment_count: data?.htn_on_treatment_count || 0,
                    dm_htn_count: data?.dm_htn_count || 0,
                    health_facility_count: data?.health_facility_count || 0,
                    not_at_risk_count: data?.not_at_risk_count || 0,
                    male_count: data?.male_count || 0,
                    female_count: data?.female_count || 0,
                    at_risk_count: data?.at_risk_count || 0,
                });
                setAgeGroups(data?.ages || []);
                setDistrictChartData({
                    labels: data?.districts?.map((d) => d.district) || [],
                    datasets: [
                        {
                            label: 'District base data captured',
                            data: data?.districts?.map((d) => d.district_count) || [],
                            backgroundColor: COLORS.map((c) => c.background),
                            borderColor: COLORS.map((c) => c.border),
                            borderWidth: 1,
                        },
                    ],
                });
            }
        } catch (error) {
            setIsLoading(false)
            console.error('Error fetching counts:', error);
        }
    };

    useEffect(() => {
        fetchCounts();
    }, []);

    if (isLoading) {
        return (<div style={{ width: '100%', height: '100%', position: 'absolute', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <img style={{ width: 50, height: 50 }} src='./loading.gif' alt='loading' />
        </div>)
    }

    return (
        <div className="role-container">
            <OverViewHeader queryParams={queryParams} />
            <div style={containerStyle} className="card-container">
                {CARD_CONFIG.map(({ title, colorIndex, fields }, index) => (
                    <OverviewCard
                        key={index}
                        style={{ backgroundColor: COLORS[colorIndex].background }}
                        title={title}
                        data={fields}
                        values={counts}
                    />
                ))}
                <OverviewCard
                    title="Age Groups"
                    data={ageGroups}
                    values={null}
                    type="age"
                    style={{ backgroundColor: COLORS[2].background }}
                />
            </div>
            <div style={chartContainerStyle}>
                {districtChartData && <Bar data={districtChartData} options={chartOptions} />}
            </div>
        </div>
    );
};

export default OverView;