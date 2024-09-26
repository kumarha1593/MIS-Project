import React, { useEffect, useState } from 'react'
import Modal from "react-modal";
import FieldCoordinator from './FieldCoordinator';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';

const SuperVisor = ({ data }) => {

    const [addRemarks, setAddRemarks] = useState(false);
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
        fetchData(currentItem)
    };

    const fetchData = async (currentItem) => {
        try {
            const response = await defaultInstance.get(API_ENDPOINTS.FAMILY_HEAD);
            if (response?.data?.success) {
                const list = response?.data?.data?.length > 0 ? response?.data?.data : []
                list?.map((item) => {
                    item.is_open = false;
                    item.is_checked = false;
                    return item;
                });
                setNextRoleData(list);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

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