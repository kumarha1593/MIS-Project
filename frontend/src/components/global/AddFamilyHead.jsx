import React, { useState } from 'react'
import TextInput from './TextInput';
import { extraGovernmentIdOptions, governmentIdOptions, validateFamilyHeadForm } from '../../utils/helper';
import defaultInstance from '../../axiosHelper';
import SelectInput from './SelectInput';

const AddFamilyHead = ({ onDone, onDismiss }) => {

    const [formData, setFormData] = useState({
        name: "",
        aadhar: "",
        govtId: "",
    });

    const [errors, setErrors] = useState({});

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const validatedData = await validateFamilyHeadForm.validate(formData, { abortEarly: false });
            const user_id = localStorage.getItem("user_id");

            const apiPayload = {
                ...validatedData,
                fc_id: user_id,
            };

            delete apiPayload.govtId;

            const response = await defaultInstance.post(`api/family-members-head`, apiPayload);
            if (response.data.success) {
                onDone?.(response);
            }

        } catch (err) {
            formatValidationErrors(err);
        }
    };

    const formatValidationErrors = (err) => {
        const formattedErrors = err?.inner?.reduce((acc, item) => {
            acc[item.path] = item.message;
            return acc;
        }, {});
        setErrors(formattedErrors || {});
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Head of Family</h2>
                <TextInput
                    type='text'
                    name="name"
                    value={formData?.name}
                    onChange={onChange}
                    error={errors?.name}
                    placeholder="Head of Family Name"
                    required
                />
                <SelectInput
                    name="govtId"
                    value={formData?.govtId}
                    options={[...governmentIdOptions, ...extraGovernmentIdOptions]}
                    onChange={onChange}
                    error={errors?.govtId}
                    placeholder="government id type"
                    required
                />
                <TextInput
                    type='text'
                    name="aadhar"
                    value={formData?.aadhar}
                    onChange={onChange}
                    error={errors?.aadhar}
                    placeholder="Enter card number"
                    maxLength="12"
                    pattern="\d{12}"
                    required
                />
                <button type='button' onClick={handleSave}>Save & Continue</button>
                <button onClick={onDismiss}>Cancel</button>
            </div>
        </div>
    )
}

export default AddFamilyHead