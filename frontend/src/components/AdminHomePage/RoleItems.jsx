import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

const RoleItems = ({
    roleItems = {},
    showAction = false,
    onClick = () => { },
    onAction = () => { }
}) => {
    return (
        <div
            className='role-items'
            style={showAction ? { padding: '0px 2px 0px 15px' } : {}}
            onClick={onClick}
        >
            <span>{roleItems.name || 'Unnamed Role'}</span>
            {showAction ? (
                <div className="actions">
                    <button
                        type='button'
                        style={{ backgroundColor: '#0d6efd' }}
                        className='common-button'
                        onClick={(evt) => {
                            evt.stopPropagation();
                            onAction('REMARKS');
                        }}
                    >
                        Add Remarks
                    </button>
                    <button
                        type='button'
                        className='common-button'
                        onClick={(evt) => {
                            evt.stopPropagation();
                            onAction('APPROVE');
                        }}
                    >
                        Approve
                    </button>
                </div>
            ) : (
                <FaChevronRight className="toggle-icon" />
            )}
        </div>
    );
};

export default RoleItems;
