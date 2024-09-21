import React from 'react';
import ZonalManager from './ZonalManager';
import RoleComponent from './RoleComponent';

const AssistantStateCoordinator = () => {
    return <RoleComponent roleName="Zonal Manager" nextRoleComponent={ZonalManager} />;
};

export default AssistantStateCoordinator;
