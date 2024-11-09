import React, { useState } from 'react'
import Modal from "react-modal";
import TextInput from '../global/TextInput';
import { validateVillageForm } from '../../utils/helper';
import defaultInstance from '../../axiosHelper';
import ButtonLoader from '../global/ButtonLoader';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';

const AddVillage = ({ visible, onDismiss }) => {

    const [formData, setFormData] = useState({
        village_name: '',
        village_id: ''
    });

    const [errors, setErrors] = useState({});
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

    const handleSubmit = async (evt) => {
        evt?.preventDefault();
        try {
            const validatedData = await validateVillageForm.validate(formData, { abortEarly: false });
            setIsLoading(true);
            const response = await defaultInstance.post(API_ENDPOINTS.CREATE_VILLAGE, validatedData)
            setIsLoading(false);
            if (response?.data?.success) {
                alert('Village created successfully!')
                onDismiss()
            }
        } catch (err) {
            setIsLoading(false);
            formatValidationErrors(err);
        }
    }

    const formatValidationErrors = (err) => {
        const formattedErrors = err?.inner?.reduce((acc, item) => {
            acc[item.path] = item.message;
            return acc;
        }, {});
        setErrors(formattedErrors || {});
    };

    const updateValue = (evt) => {
        const { name, value } = evt.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    }

    return (
        <Modal
            isOpen={visible}
            onRequestClose={onDismiss}
            contentLabel="Add Village"
            style={customStyles}
        >
            <div style={{ padding: '20px' }}>
                <h2>Add Village</h2>
                <form noValidate>
                    <TextInput
                        label="Village Name"
                        name="village_name"
                        value={formData?.village_name}
                        onChange={updateValue}
                        error={errors?.village_name}
                        type='text'
                        required
                    />
                    <TextInput
                        label="Village Id"
                        name="village_id"
                        value={formData?.village_id}
                        onChange={updateValue}
                        error={errors?.village_id}
                        type='text'
                        required
                    />
                </form>
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

export default AddVillage