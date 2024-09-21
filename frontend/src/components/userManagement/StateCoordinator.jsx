import React from 'react';
import AssistantStateCoordinator from './AssistantStateCoordinator';
import RoleComponent from './RoleComponent';

const StateCoordinator = () => {
    return <RoleComponent roleName="Assistant State Coordinator" nextRoleComponent={AssistantStateCoordinator} />;
};

export default StateCoordinator;
