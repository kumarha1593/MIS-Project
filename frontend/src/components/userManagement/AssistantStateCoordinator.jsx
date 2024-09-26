import React, { useEffect, useState } from 'react';
import ZonalManager from './ZonalManager';
import RoleComponent from './RoleComponent';
import { getUserDataByRole, ROLE_TYPE } from '../../utils/helper';

const AssistantStateCoordinator = ({ data }) => {

    const [allData, setAllData] = useState([]);
    const [nextRoleData, setNextRoleData] = useState([]);

    useEffect(() => {
        if (data?.length > 0) {
            setAllData(data)
        }
    }, [JSON.stringify(data)])

    const toggleVisibility = (idx, currentItem) => {
        setAllData((prev) => {
            const newVisibility = prev.map((item) => ({ ...item, is_open: false }));
            newVisibility[idx].is_open = !prev[idx].is_open;
            return newVisibility;
        });
        getUserDataByRole(ROLE_TYPE.ZONAL_MANAGER, (list) => {
            setNextRoleData(list);
        })
    };

    return <RoleComponent
        nextRoleComponent={ZonalManager}
        nextRoleData={nextRoleData}
        toggleVisibility={toggleVisibility}
        data={allData}
    />;
};

export default AssistantStateCoordinator;
