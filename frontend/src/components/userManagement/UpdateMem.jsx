import React, { useEffect, useState } from 'react'
import ButtonLoader from '../global/ButtonLoader';
import Modal from "react-modal";
import TextInput from '../global/TextInput';
import SelectInput from '../global/SelectInput';
import { inputFields } from '../../utils/helper';
import SearchableDropdown from '../global/SearchableDropdown';
import defaultInstance from '../../axiosHelper';
import { API_ENDPOINTS } from '../../utils/apiEndPoints';

const UpdateMem = ({ visible, onDismiss, data }) => {

    const [villageOptions, setVillageOptions] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(null);

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
        // Perform update operation here
        setIsLoading(false);
        onDismiss();
    }

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

    useEffect(() => {
        if (visible) {
            fetchVillages()
        }
    }, [visible]);

    return (
        <Modal
            isOpen={visible}
            onRequestClose={onDismiss}
            style={customStyles}
        >
            <div style={{ padding: '20px' }}>
                <h2>Update Member Details</h2>
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
                            {row.map(({ label, name, type, options }) =>
                                type === 'select' ? (
                                    <SelectInput
                                        key={name}
                                        label={label}
                                        name={name}
                                        value={formData?.[name] || ''}
                                        options={options}
                                        onChange={updateValue}
                                        style={{ width: '49%' }}
                                        hideLabel
                                    />
                                ) : type === 'village' ? (
                                    <SearchableDropdown
                                        options={villageOptions}
                                        onSelect={(data) => {
                                            setFormData(prev => ({ ...prev, ['village']: `${data?.label} / ${data?.value}` }));
                                        }}
                                        label='Village Name'
                                        style={{ width: '49%' }}
                                        value={formData?.village || ''}
                                        inputStyle={{ padding: '11px' }}
                                        labelStyle={{ marginTop: '-15px' }}
                                    />
                                ) :
                                    (
                                        <TextInput
                                            key={name}
                                            label={label}
                                            name={name}
                                            value={formData?.[name] || ''}
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
                        disabled={isLoading}
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