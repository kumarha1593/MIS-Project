import React, { useState } from 'react'
import Modal from "react-modal";
import ButtonLoader from '../global/ButtonLoader';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';
import { MdOutlineClose } from "react-icons/md";
import { IoIosDocument } from "react-icons/io";
const UploadBulkUser = ({ visible, onDismiss, onDone, selectedFile }) => {

    const [isLoading, setIsLoading] = useState(false);

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '30%'
        },
        overlay: {
            backgroundColor: 'rgba(0,0,0,0.8)'
        }
    };

    const handleSubmit = () => {
        const fd = new FormData();
        fd.append('file', selectedFile);
        setIsLoading(true)
        defaultInstance.post(API_ENDPOINTS.IMPORT_MASTER_LIST, fd).then((res) => {
            setIsLoading(false)
            if (!res?.data?.success) {
                alert(res?.data?.message);
                return
            }
            if (res?.data?.success) {
                alert("User created successfully!");
                onDone?.();
            }
        }).catch((err) => console.log(err))
    }

    return (
        <Modal
            isOpen={visible}
            onRequestClose={onDismiss}
            style={customStyles}
        >
            <div style={{ padding: '20px' }}>
                <h2>Bulk Import</h2>
                <div onClick={onDismiss} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }}>
                    <MdOutlineClose size={30} />
                </div>
                <div className='document-wrap'>
                    <IoIosDocument size={20} />
                    <span style={{ marginLeft: '8px' }}>{selectedFile?.name || 'document.csv'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        disabled={isLoading}
                        className='common-button'
                        type='submit'
                        onClick={handleSubmit}
                    >
                        {isLoading ? <ButtonLoader /> : 'Submit'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default UploadBulkUser