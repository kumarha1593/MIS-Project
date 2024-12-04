import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OverViewHeader from './OverViewHeader';
import OverviewCard from './OverviewCard';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';
import { defaultDistrict } from '../../utils/helper';
import cloneDeep from 'lodash/cloneDeep'

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
    { background: 'rgba(0, 128, 128, 0.6)', border: 'rgba(0, 128, 128, 1)' },
    { background: 'rgba(128, 0, 128, 0.6)', border: 'rgba(128, 0, 128, 1)' },
    { background: 'rgba(128, 128, 0, 0.6)', border: 'rgba(128, 128, 0, 1)' },
    { background: 'rgba(255, 20, 147, 0.6)', border: 'rgba(255, 20, 147, 1)' },
    { background: 'rgba(0, 100, 0, 0.6)', border: 'rgba(0, 100, 0, 1)' },
    { background: 'rgba(70, 130, 180, 0.6)', border: 'rgba(70, 130, 180, 1)' },
    { background: 'rgba(210, 105, 30, 0.6)', border: 'rgba(210, 105, 30, 1)' },
    { background: 'rgba(244, 164, 96, 0.6)', border: 'rgba(244, 164, 96, 1)' },
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
        title: 'Total Screenings',
        fields: [{ label: 'Total Screenings: ', key: 'total_screenings_till_date' }],
        background: 'rgba(255, 99, 132, 0.2)',
        route: '/state-screening'
    },
    {
        title: 'Health Facility',
        fields: [{ label: 'Health Facility: ', key: 'health_facility_count' }],
        background: 'rgba(54, 162, 235, 0.2)',
        route: '/health-facility-status'
    },
    {
        title: 'Villages',
        fields: [{ label: 'Total Villages: ', key: 'village_count' }],
        background: 'rgba(255, 206, 86, 0.2)',
        route: ''
    },
    {
        title: 'HTN Known Case',
        fields: [
            { label: 'On treatment: ', key: 'htn_on_treatment_count' },
            { label: 'Not on treatment: ', key: 'htn_not_on_treatment_count' },
        ],
        background: 'rgba(75, 192, 192, 0.2)',
        route: ''
    },
    {
        title: 'DM Known Case',
        fields: [
            { label: 'On treatment: ', key: 'dm_on_treatment_count' },
            { label: 'Not on treatment: ', key: 'dm_not_on_treatment_count' },
        ],
        background: 'rgba(153, 102, 255, 0.2)',
        route: ''
    },
    {
        title: 'DM/HTN Known Case',
        fields: [{ label: 'Total: ', key: 'dm_htn_count' }],
        background: 'rgba(255, 159, 64, 0.2)',
        route: ''
    },
    {
        title: 'Sex',
        fields: [
            { label: 'Male: ', key: 'male_count' },
            { label: 'Female: ', key: 'female_count' },
        ],
        background: 'rgba(199, 199, 199, 0.2)',
        route: ''
    },
    {
        title: 'Age Groups',
        fields: [],
        background: 'rgba(83, 102, 255, 0.2)',
        route: ''
    },
    {
        title: 'Risk Assessments',
        fields: [
            { label: 'At risk: ', key: 'at_risk_count' },
            { label: 'Not at risk: ', key: 'not_at_risk_count' },
        ],
        background: 'rgba(0, 128, 128, 0.2)',
        route: ''
    },

];

const containerStyle = { marginTop: 40 };
const chartContainerStyle = { marginTop: 50 };

const OverView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = Object.fromEntries(new URLSearchParams(location?.search));

    const [ageGroups, setAgeGroups] = useState([]);
    const [districtChartData, setDistrictChartData] = useState(null);
    const [counts, setCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Function to clean and merge duplicate districts
    // const mergeDistricts = (data) => {
    //     const merged = cloneDeep(defaultDistrict)
    //     data.forEach(entry => {
    //         if (entry?.district == 'Bishnupur' || entry?.district == "Bishnupur ") {
    //             merged[0].district_count += entry.district_count;
    //         } else if (entry?.district == 'Chandel' || entry?.district == "CHANDEL" || entry?.district == "Chandel ") {
    //             merged[1].district_count += entry.district_count;
    //         } else if (entry?.district == 'Churachandpur') {
    //             merged[2].district_count += entry.district_count;
    //         } else if (entry?.district == 'Imphal East' || entry?.district == 'Imphal east' || entry?.district == 'Imphal east(kshetri bangoon awang leikai kshetrigao)') {
    //             merged[3].district_count += entry.district_count;
    //         } else if (entry?.district == 'Imphal West' || entry?.district == 'IHMPHAL WEST' || entry?.district == "Imphal West " || entry?.district == "IW") {
    //             merged[4].district_count += entry.district_count;
    //         } else if (entry?.district == 'Jiribam' || entry?.district == "Jiribam " || entry?.district == " Jiribam ") {
    //             merged[5].district_count += entry.district_count;
    //         } else if (entry?.district == 'Kakching' || entry?.district == "Kakching " || entry?.district == "kakching ") {
    //             merged[6].district_count += entry.district_count;
    //         } else if (entry?.district == 'Kamjong') {
    //             merged[7].district_count += entry.district_count;
    //         } else if (entry?.district == 'Kangpokpi' || entry?.district == "kangpokpi" || entry?.district == "Kangpokpi ") {
    //             merged[8].district_count += entry.district_count;
    //         } else if (entry?.district == 'Noney') {
    //             merged[9].district_count += entry.district_count;
    //         } else if (entry?.district == 'Pherzawl') {
    //             merged[10].district_count += entry.district_count;
    //         } else if (entry?.district == 'Senapati' || entry?.district == "Senapati " || entry?.district == "SENAPATI") {
    //             merged[11].district_count += entry.district_count;
    //         } else if (entry?.district == 'Tamenglong') {
    //             merged[12].district_count += entry.district_count;
    //         } else if (entry?.district == 'Tengnoupal') {
    //             merged[13].district_count += entry.district_count;
    //         } else if (entry?.district == 'Thoubal' || entry?.district == "Thoubal " || entry?.district == "Thouba" || entry?.district == "Thoubal wangmataba" || entry?.district == "THOUBAL DISTRICT" || entry?.district == "Thoubal bazar") {
    //             merged[14].district_count += entry.district_count;
    //         } else if (entry?.district == 'Ukhrul') {
    //             merged[15].district_count += entry.district_count;
    //         }
    //     });
    //     return merged;
    // }

    const mergeDistricts = (data) => {
        const merged = cloneDeep(defaultDistrict);
        const districtMap = {
            'Bishnupur': 0,
            'Bishnupur ': 0,
            'Chandel': 1,
            'CHANDEL': 1,
            'Chandel ': 1,
            'Churachandpur': 2,
            'Imphal East': 3,
            'Imphal east': 3,
            'Imphal east(kshetri bangoon awang leikai kshetrigao)': 3,
            'Imphal West': 4,
            'IHMPHAL WEST': 4,
            'Imphal West ': 4,
            'IW': 4,
            'Jiribam': 5,
            'Jiribam ': 5,
            ' Jiribam ': 5,
            'Kakching': 6,
            'Kakching ': 6,
            'kakching ': 6,
            'Kamjong': 7,
            'Kangpokpi': 8,
            'kangpokpi': 8,
            'Kangpokpi ': 8,
            'Noney': 9,
            'Pherzawl': 10,
            'Senapati': 11,
            'Senapati ': 11,
            'SENAPATI': 11,
            'Tamenglong': 12,
            'Tengnoupal': 13,
            'Thoubal': 14,
            'Thoubal ': 14,
            'Thouba': 14,
            'Thoubal wangmataba': 14,
            'THOUBAL DISTRICT': 14,
            'Thoubal bazar': 14,
            'Ukhrul': 15
        };

        // Process each entry in the data array
        data.forEach(entry => {
            const districtIndex = districtMap[entry?.district];
            if (districtIndex !== undefined) {
                merged[districtIndex].district_count += entry.district_count;
            }
        });

        return merged;
    };

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
                    total_screenings_till_date: data?.total_screenings_till_date || 0,
                    village_count: data?.village_count || 0,
                });
                setAgeGroups(data?.ages || []);
                const mergedData = mergeDistricts(data?.districts);
                setDistrictChartData({
                    labels: mergedData?.map((d) => d.label) || [],
                    datasets: [
                        {
                            label: 'District base data captured',
                            data: mergedData?.map((d) => d.district_count) || [],
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
                {CARD_CONFIG.map(({ title, fields, background, route }, index) => (
                    <OverviewCard
                        key={index}
                        style={{ backgroundColor: background }}
                        title={title}
                        data={title === 'Age Groups' ? ageGroups : fields}
                        values={title === 'Age Groups' ? null : counts}
                        type={title === 'Age Groups' ? 'age' : ''}
                        onClick={() => {
                            if (route) {
                                navigate(route);
                            }
                        }}
                    />
                ))}
            </div>
            <div style={chartContainerStyle}>
                {districtChartData && <Bar
                    data={districtChartData}
                    options={chartOptions}
                    onClick={(event, elements) => {
                        navigate('/state-screening', {
                            state: { action_type: 'district', data: 'Imphal' }
                        });
                    }}
                />}
            </div>
        </div>
    );
};

export default OverView;