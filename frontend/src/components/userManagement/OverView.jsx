import React from 'react'
import { useLocation } from 'react-router-dom';
import OverViewHeader from './OverViewHeader';
import OverviewCard from './OverviewCard';

const OverView = () => {


    const location = useLocation();

    const queryParams = Object.fromEntries(new URLSearchParams(location?.search));

    const getRandomLightColor = () => {
        const r = Math.floor(Math.random() * 156) + 100; // Red (100-255)
        const g = Math.floor(Math.random() * 156) + 100; // Green (100-255)
        const b = Math.floor(Math.random() * 156) + 100; // Blue (100-255)
        return `rgb(${r}, ${g}, ${b})`;
    }

    return (
        <div className="role-container">
            <OverViewHeader
                queryParams={queryParams}
            />

            <div style={{ marginTop: 40 }} className="card-container">
                <OverviewCard
                    style={{ backgroundColor: getRandomLightColor() }}
                    title='Screenings'
                    data={[
                        { label: 'Total Screening', value: 0 }
                    ]}
                />
                <OverviewCard
                    style={{ backgroundColor: getRandomLightColor() }}
                    title='District'
                    data={[
                        { label: 'Total District Covered', value: 0 }
                    ]}
                />
                <OverviewCard
                    style={{ backgroundColor: getRandomLightColor() }}
                    title='Village'
                    data={[
                        { label: 'Total Village Covered', value: 0 }
                    ]}
                />
            </div>

            <div className="card-container">
                <OverviewCard
                    style={{ backgroundColor: getRandomLightColor() }}
                    title='Health Facility'
                    data={[
                        { label: 'Total Health Facility Covered', value: 0 }
                    ]}
                />
                <OverviewCard
                    style={{ backgroundColor: getRandomLightColor() }}
                    title='Suspected/Referred '
                    data={[
                        { label: 'HTN/DM', value: ": 0/0" },
                        { label: 'ETC/Others', value: ': 0/0' }
                    ]}
                />
                <OverviewCard
                    style={{ backgroundColor: getRandomLightColor() }}
                    title='Know Case'
                    data={[
                        { label: 'HTN/DM', value: ": 0/0" },
                        { label: 'ETC/Others', value: ': 0/0' }
                    ]}
                />
            </div>

            <div className="card-container">
                {/* <OverviewCard
                    style={{ backgroundColor: getRandomLightColor() }}
                    title='Total Screening District Wise '
                    data={[
                        { label: 'Imphal West', value: 0 },
                        { label: 'Imphal East', value: 0 },
                        { label: 'Thoubal', value: 0 },
                        { label: 'Kakching', value: 0 },
                        { label: 'Senapati', value: 0 },
                        { label: 'Kangpokpi', value: 0 },
                        { label: 'Jiribam', value: 0 },
                        { label: 'Tamenglonge', value: 0 },
                        { label: 'ETC', value: 0 },
                    ]}
                /> */}
                <OverviewCard
                    style={{ backgroundColor: getRandomLightColor(), maxHeight: '140px' }}
                    title='Total Screening By Genders'
                    data={[
                        { label: 'Male', value: 0 },
                        { label: 'FeMale', value: 0 },
                        { label: 'Others', value: 0 },
                    ]}
                />
            </div>

        </div>
    )
}

export default OverView