import React from 'react';
import AssistantStateCoordinator from './AssistantStateCoordinator';
import RoleComponent from './RoleComponent';
import { ROLE_TYPE } from '../../utils/helper';
import useManageData from './useManageData';

const StateCoordinator = ({ data }) => {

    const { allData, nextRoleData, toggleVisibility } = useManageData(data, ROLE_TYPE.ASSISTANT_STATE_COORDINATOR);

    return <RoleComponent
        data={allData}
        nextRoleComponent={AssistantStateCoordinator}
        nextRoleData={nextRoleData}
        toggleVisibility={toggleVisibility}
    />;
};

export default StateCoordinator;
