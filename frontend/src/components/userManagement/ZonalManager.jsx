import React, { useEffect, useState } from 'react';
import SuperVisor from './SuperVisor';
import RoleComponent from './RoleComponent';
import { getUserDataByRole, ROLE_TYPE } from '../../utils/helper';

const ZonalManager = ({ data }) => {
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
        getUserDataByRole(ROLE_TYPE.SUPER_VISOR, (list) => {
            setNextRoleData(list);
        })
    };

    return <RoleComponent
        nextRoleComponent={SuperVisor}
        nextRoleData={nextRoleData}
        toggleVisibility={toggleVisibility}
        data={allData}
    />;
};

export default ZonalManager;
