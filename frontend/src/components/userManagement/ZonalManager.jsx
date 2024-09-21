import React from 'react';
import SuperVisor from './SuperVisor';
import RoleComponent from './RoleComponent';

const ZonalManager = () => {
    return <RoleComponent roleName="Supervisor" nextRoleComponent={SuperVisor} />;
};

export default ZonalManager;
