import { React, useState } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Input, Tooltip, Radio } from 'antd';
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { getCategories } from '../../Utils/utils';


export default function LocationModal({ handleOk, handleCancel, isModalVisible,
    error, setError,
    name, setName,
    address, setAddress,
    coordinates, setCoordinates,
    category, setCategory }) {

    function handleCategorySelected(e) {
        setCategory(e.target.value);
    }
    

    function getCategoriesSection() {
        const categories = getCategories();

        if (categories.length == 0) {
            return <div className='create-category'>
                <WarningOutlined />
                 No Categries yet, please add a category first
            </div>
        }

        return <Radio.Group value={category}>
            {
                categories.length > 0 &&
                categories.map(category => <Radio key={category.id} value={category.id} onClick={handleCategorySelected}>
                    {category.name}
                </Radio>)
            }
        </Radio.Group>
    }

    return <Modal title='New Location' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div className='user-input'>
            <div className='label'>Name
            <Tooltip title='Location name must be unique'>
                    <InfoCircleOutlined />
                </Tooltip>
            </div>
            <Input placeholder='name'
                value={name}
                onChange={(e) => { setError(undefined); setName(e.target.value) }} />
        </div>
        <div className='user-input'>
            <div className='label'>Address</div>
            <Input placeholder='Address'
                value={address}
                onChange={(e) => { setError(undefined); setAddress(e.target.value) }} />
        </div>
        <div className='user-input'>
            <div className='label'>Coordinates
            <a href='https://support.google.com/maps/answer/18539?co=GENIE.Platform%3DDesktop&hl=en' target="_blank">
                    need help?
            </a>
            </div>
            <Input placeholder='Coordinates'
                value={coordinates}
                onChange={(e) => { setError(undefined); setCoordinates(e.target.value) }} />
        </div>
        <div className='user-input'>
            <div className='label'>Category</div>
            {getCategoriesSection()}
        </div>

        {
            error && <div className='error'>
                {error}
            </div>
        }
    </Modal>
}