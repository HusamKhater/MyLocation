import { React, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import LocationModal from '../LocationModal/LocationModal';


export default function AddLocation({ onLocationAdded, isValidNewLocation }) {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [error, setError] = useState(undefined);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState('');
    const [category, setCategory] = useState('');

    function resetStates() {
        setError(undefined);
        setName('');
        setAddress('');
        setCoordinates('');
        setCategory('');
        setIsModalVisible(false);
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (!name || !address || !coordinates || !category) {
            setError('please fill all parameters above')
            return
        }

        const location = {
            id: uuidv4(),
            name,
            address,
            coordinates,
            category
        }

        const validationResult = isValidNewLocation(location);
        if (!validationResult.isValid) {
            setError(validationResult.error);
            return;
        }

        if (onLocationAdded) {
            onLocationAdded(location);
        }

        resetStates();
    };

    const handleCancel = () => {
        resetStates();
    };

    return <div className='add-location'>
        <Tooltip title="Add New Location">
            <Button onClick={showModal}
                type="primary"
                icon={<PlusOutlined />} >
                Add
            </Button>
        </Tooltip>

        <LocationModal handleCancel={handleCancel} handleOk={handleOk} isModalVisible={isModalVisible}
            error={error} setError={setError} name={name} setName={setName} address={address} setAddress={setAddress}
            coordinates={coordinates} setCoordinates={setCoordinates} category={category} setCategory={setCategory} />
    </div>
}