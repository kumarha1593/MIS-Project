import React from 'react';
import SuperVisor from './SuperVisor';
import RoleComponent from './RoleComponent';
import { ROLE_TYPE } from '../../utils/helper';
import useManageData from './useManageData';

const ZonalManager = ({ data }) => {

    const { allData, nextRoleData, toggleVisibility } = useManageData(data, ROLE_TYPE.SUPER_VISOR);

    return <RoleComponent
        nextRoleComponent={SuperVisor}
        nextRoleData={nextRoleData}
        toggleVisibility={toggleVisibility}
        data={allData}
    />;
};

export default ZonalManager;
