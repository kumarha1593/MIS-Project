import React, { useState } from 'react'
import Modal from "react-modal";
import FieldCoordinator from './FieldCoordinator';
import useManageData from './useManageData';

const SuperVisor = ({ data }) => {

    const [addRemarks, setAddRemarks] = useState(false);

    const { allData, nextRoleData, toggleVisibility } = useManageData(data, null, true);

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
            <FieldCoordinator
                setAddRemarks={setAddRemarks}
                data={allData}
                toggleVisibility={toggleVisibility}
                nextRoleData={nextRoleData}
            />
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