import React, { useEffect, useState } from 'react';
import AssistantStateCoordinator from './AssistantStateCoordinator';
import RoleComponent from './RoleComponent';
import { getUserDataByRole, ROLE_TYPE } from '../../utils/helper';

const StateCoordinator = ({ data }) => {

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
        getUserDataByRole(ROLE_TYPE.ASSISTANT_STATE_COORDINATOR, (list) => {
            setNextRoleData(list);
        })
    };

    return <RoleComponent
        data={allData}
        nextRoleComponent={AssistantStateCoordinator}
        nextRoleData={nextRoleData}
        toggleVisibility={toggleVisibility}
    />;
};

export default StateCoordinator;
