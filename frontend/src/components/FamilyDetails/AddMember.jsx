import React, { useState } from 'react'
import TextInput from '../global/TextInput';
import defaultInstance from '../../axiosHelper';
import { validateMemForm } from '../../utils/helper';

const AddMember = ({ headId, onDismiss, onDone }) => {

    const [formData, setFormData] = useState({
        name: '',
        aadhar: ''
    });

    const [errors, setErrors] = useState({});

    const handleSubmit = async (evt) => {
        evt?.preventDefault();
        const user_id = localStorage.getItem("user_id");
        try {

            const validatedData = await validateMemForm.validate(formData, { abortEarly: false });
            const payload = {
                fc_id: user_id,
                head_id: headId,
                ...validatedData
            }
            const response = await defaultInstance.post('api/family-members/', payload)
            if (response?.data?.success) {
                alert('Member created successfully!')
                onDone()
            }
        } catch (err) {
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
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Family Member</h2>
                <form noValidate>
                    <TextInput
                        label="Name"
                        name="name"
                        value={formData?.name}
                        onChange={updateValue}
                        error={errors?.name}
                        type='text'
                        required
                    />
                    <TextInput
                        label="Aadhar Number"
                        name="aadhar"
                        value={formData?.aadhar}
                        onChange={updateValue}
                        error={errors?.aadhar}
                        type='text'
                        required
                    />
                </form>
                <button onClick={handleSubmit} type='button'>
                    Submit
                </button>
                <button onClick={onDismiss}>Cancel</button>
            </div>
        </div>
    )
}

export default AddMember