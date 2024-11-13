import React, { useEffect, useState } from 'react'
import ButtonLoader from '../global/ButtonLoader';
import Modal from "react-modal";
import TextInput from '../global/TextInput';
import SelectInput from '../global/SelectInput';
import { formFields, inputFields } from '../../utils/helper';
import { MdOutlineClose } from "react-icons/md";
import moment from 'moment';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';
import SearchableDropdown from '../global/SearchableDropdown';
const UpdateMem = ({ visible, onDismiss, data, onDone }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(formFields);
    const [villageOptions, setVillageOptions] = useState([])
    const [familyMem, setFamilyMem] = useState([])

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            overflowY: 'scroll',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px',
            backgroundColor: 'white',
        },
        overlay: {
            backgroundColor: 'rgba(0,0,0,0.8)'
        }
    };

    const updateValue = (evt) => {
        const { name, value } = evt.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await defaultInstance.put(`${API_ENDPOINTS.UPDATE_MASTER_LIST}${data?.fm_id}/`, { ...formData, fc_id: Number(formData?.fc_id || 0) });
        setIsLoading(false);
        if (!response?.data?.success) {
            alert(response?.data?.message);
            return
        }
        if (response?.data?.success) {
            onDone();
        }
    }

    const updateFormData = (item) => {
        const dateFields = ['pi_dob', 'cvd_date', 'screening_date'];
        const smallFields = ["alcohol_use", "family_diabetes_history"];

        const obj = Object.keys(formData).reduce((acc, key) => {
            if (dateFields.includes(key)) {
                acc[key] = item[key] ? moment(item[key]).format('YYYY-MM-DD') : '';
            } else if (smallFields.includes(key)) {
                acc[key] = ["0", "yes", "Yes"].includes(item[key]) ? "Yes" : ["1", "no", "No"].includes(item[key]) ? "No" : ''
            } else if (key == "screening_status") {
                acc[key] = 1;
            } else {
                acc[key] = item[key] || '';
            }
            return acc;
        }, {});
        setFormData(obj);
    };

    const fetchVillages = async () => {
        const response = await defaultInstance.get(API_ENDPOINTS.VILLAGE_LIST);
        if (response?.data?.success) {
            const villages = response?.data?.data?.map(({ village_id, name }) => ({
                value: village_id,
                label: name,
            }));
            setVillageOptions(villages)
        }
    }

    const fetchMem = async () => {
        const params = {
            fc_id: data?.fc_id || 0,
            search_term: '',
        }
        const response = await defaultInstance.get(API_ENDPOINTS.FAMILY_MEMBER_LIST, { params: params });
        if (response?.data?.success) {
            const villages = response?.data?.data?.map(({ name }) => ({
                value: name,
                label: name,
            }));
            setFamilyMem(villages)
        }
    }

    useEffect(() => {
        if (visible && data) {
            updateFormData(data);
            fetchVillages();
            fetchMem();
        }
    }, [visible, JSON.stringify(data)]);

    return (
        <Modal
            isOpen={visible}
            onRequestClose={() => { }}
            style={customStyles}
        >
            <div style={{ padding: '20px' }}>
                <h2>Update Member Details</h2>
                <div onClick={onDismiss} style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer' }}>
                    <MdOutlineClose size={30} />
                </div>
                <form noValidate>
                    {inputFields.reduce((acc, field, index) => {
                        if (index % 2 === 0) {
                            acc.push([field]);
                        } else {
                            acc[acc.length - 1].push(field);
                        }
                        return acc;
                    }, []).map((row, idx) => (
                        <div className="input-wrapper" key={idx}>
                            {row?.map(({ label, key, type, options, select_type }) =>
                                type === 'select'
                                    ?
                                    (
                                        <SelectInput
                                            key={key}
                                            label={label}
                                            name={key}
                                            value={formData?.[key] || ''}
                                            options={select_type == 'custom' ? familyMem : options}
                                            onChange={updateValue}
                                            style={{ width: '49%' }}
                                            hideLabel
                                        />
                                    )
                                    :
                                    type === 'village'
                                        ?
                                        (
                                            <SearchableDropdown
                                                options={villageOptions}
                                                onSelect={(data) => {
                                                    setFormData(prev => ({ ...prev, ['village']: `${data?.label} / ${data?.value}` }));
                                                }}
                                                style={{ width: '49%', marginTop: '-16px' }}
                                                value={formData?.['village'] ? String(formData?.['village']) : ''}
                                                placeholder={formData?.['village'] ? String(formData?.['village']) : 'Select Village'}
                                                inputStyle={{ padding: '10px' }}
                                                label="Village"
                                            />
                                        )
                                        :
                                        (
                                            <TextInput
                                                key={key}
                                                label={label}
                                                name={key}
                                                value={formData?.[key] || ''}
                                                onChange={updateValue}
                                                type={type}
                                                style={{ width: '49%' }}
                                            />
                                        )
                            )}
                        </div>
                    ))}
                </form>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        // disabled={isLoading}
                        className='common-button'
                        type='submit'
                        onClick={handleSubmit}
                    >
                        {isLoading ? <ButtonLoader /> : 'Submit & Update'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default UpdateMem