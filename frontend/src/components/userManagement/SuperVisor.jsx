import React, { useState } from 'react'
import RoleItems from './RoleItems';
import FamilyMembers from './FamilyMembers';
import Modal from "react-modal";

const SuperVisor = () => {

    const [addRemarks, setAddRemarks] = useState(false)
    const [visibleFCs, setVisibleFCs] = useState(Array(10).fill({ name: 'Field Coordinator', is_open: false, is_checked: false }));
    const [visibleFHs, setVisibleFHs] = useState(Array(10).fill({ name: 'Family Head', is_open: false, is_checked: false }));

    const toggleFCVisibility = (fcIdx) => {
        setVisibleFCs((prev) => {
            const newVisibility = prev.map((item) => ({ ...item, is_open: false }));
            newVisibility[fcIdx].is_open = !prev[fcIdx].is_open;
            return newVisibility;
        });
    };

    const toggleFHVisibility = (fhIdx) => {
        setVisibleFHs((prev) => {
            const newVisibility = prev.map((item) => ({ ...item, is_open: false }));
            newVisibility[fhIdx].is_open = !prev[fhIdx].is_open;
            return newVisibility;
        });
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    return (
        <div className=''>
            {visibleFCs.map((fc, fcIdx) => (
                <div className="common-container" key={fcIdx}>
                    <RoleItems
                        onClick={() => toggleFCVisibility(fcIdx)}
                        roleItems={{ name: `${fc?.name} ${fcIdx + 1}` }}
                    />
                    {visibleFCs[fcIdx]?.is_open && (
                        <div className='common-left-alignment'>
                            {visibleFHs.map((fh, fhIdx) => (
                                <div className="common-container" key={fhIdx}>
                                    <RoleItems
                                        onClick={() => toggleFHVisibility(fhIdx)}
                                        roleItems={{ name: `${fh?.name} ${fhIdx + 1}` }}
                                        showAction
                                        onAction={(type) => {
                                            if (type === 'REMARKS') {
                                                setAddRemarks(true)
                                            }
                                            if (type === 'APPROVE') {
                                                alert('Approve success!')
                                                // Approve logic
                                            }
                                        }}
                                    />
                                    {visibleFHs[fhIdx]?.is_open && (
                                        <div style={{ paddingLeft: '30px', paddingTop: '10px' }}>
                                            <FamilyMembers />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <Modal
                isOpen={addRemarks}
                onRequestClose={() => setAddRemarks(false)}
                contentLabel="Add Remarks"
                style={customStyles}
            >
                <div style={{ padding: '20px', }}>
                    <h2>Add Remarks*</h2>
                    <form onSubmit={() => { }}>
                        <input
                            type="text"
                            name="add_remarks"
                            value=""
                            onChange={() => { }}
                            placeholder='Please enter remarks'
                            required
                        />
                    </form>
                    <button
                        style={{ margin: '20px auto 0px' }}
                        onClick={() => setAddRemarks(false)}
                        className='common-button'
                    >
                        Submit
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default SuperVisor