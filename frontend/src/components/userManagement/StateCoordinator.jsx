import React, { useState } from 'react'
import AssistantStateCoordinator from './AssistantStateCoordinator';
import RoleItems from './RoleItems';

const StateCoordinator = () => {


    const [data, setData] = useState(Array(10).fill({ name: 'Assistant State Coordinator', is_open: false, is_checked: false }));

    const toggleVisibility = (idx) => {
        setData((prev) => {
            const newVisibility = prev.map((item) => ({ ...item, is_open: false }));
            newVisibility[idx].is_open = !prev[idx].is_open;
            return newVisibility;
        });
    };

    return (
        <div className="">
            {data?.map((item, idx) => {
                return (
                    <div className="common-container" key={idx}>
                        <RoleItems
                            onClick={() => toggleVisibility(idx)}
                            roleItems={{ name: `${item?.name} ${idx + 1}` }}
                        />
                        {data[idx]?.is_open && (
                            <div className="common-left-alignment">
                                <AssistantStateCoordinator />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default StateCoordinator