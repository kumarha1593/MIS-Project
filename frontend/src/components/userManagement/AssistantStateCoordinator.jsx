import React from 'react';
import ZonalManager from './ZonalManager';
import RoleComponent from './RoleComponent';
import { ROLE_TYPE } from '../../utils/helper';
import useManageData from './useManageData';

const AssistantStateCoordinator = ({ data }) => {

    const { allData, nextRoleData, toggleVisibility } = useManageData(data, ROLE_TYPE.ZONAL_MANAGER);

    return <RoleComponent
        nextRoleComponent={ZonalManager}
        nextRoleData={nextRoleData}
        toggleVisibility={toggleVisibility}
        data={allData}
    />;
};

export default AssistantStateCoordinator;
