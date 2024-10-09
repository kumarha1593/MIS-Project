import React, { useEffect, useState } from 'react'
import SuperVisor from './SuperVisor'
import { useLocation } from 'react-router-dom';
import AssistantStateCoordinator from './AssistantStateCoordinator';
import StateCoordinator from './StateCoordinator';
import ZonalManager from './ZonalManager';
import Filters from './Filters';
import { getUserDataByRole, ROLE_TYPE } from '../../utils/helper';

const Users = () => {

    const location = useLocation();

    const queryParams = Object.fromEntries(new URLSearchParams(location?.search));

    const [allData, setAllData] = useState([]);

    const fetchUsers = async () => {
        getUserDataByRole(queryParams, (data) => {
            setAllData(data);
        })
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const renderMainView = () => {
        switch (queryParams?.role_type) {
            case ROLE_TYPE.SUPER_VISOR:
                return <SuperVisor data={allData} />;
            case ROLE_TYPE.ASSISTANT_STATE_COORDINATOR:
                return <AssistantStateCoordinator data={allData} />;
            case ROLE_TYPE.STATE_COORDINATOR:
                return <StateCoordinator data={allData} />;
            case ROLE_TYPE.ZONAL_MANAGER:
                return <ZonalManager data={allData} />;
            default:
                return <p>No users found for this role</p>;
        }
    };

    return (
        <div className="role-container">
            <Filters queryParams={queryParams} />
            {renderMainView()}
        </div>
    )
}

export default Users