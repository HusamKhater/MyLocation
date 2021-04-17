import { React, useState } from 'react';
import { Space, Table, Modal, Input, Radio } from 'antd';
import { getCategories } from '../../Utils/utils';



export default function LocationsTable({ locations, onLocationDelete, onLocationEditted }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [edittedLocation, setEdittedLocation] = useState(undefined);
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  function resetStates() {
    setError(undefined);
    setName('');
    setAddress('');
    setCoordinates('');
    setCategory('');
    setIsEditModalVisible(false);
}

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      sorter: true,
      sorter: {
        compare: (a, b) => a.name > b.name
      }
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '20%',
    },
    {
      title: 'Coordinates',
      dataIndex: 'coordinates',
      width: '20%'
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      filters: getCategoryFilters(),
      onFilter: (value, record) => record.category.name == value,
      sorter: true,
      sorter: {
        compare: (a, b) => a.category.name.localeCompare(b.category.name)
      }
    },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <Space size='middle'>
          <a onClick={() => handleShowInMap(record)}>Show in map</a>
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => handleDelete(record)}>Delete</a>
        </Space>
      )
    }
  ];

  function handleDelete(record) {
    onLocationDelete(record.id);
  }

  function handleShowInMap(record) {
    const { coordinates } = record;
    window.open("https://maps.google.com?q=" + coordinates);
  }

  function handleEdit(record) {
    setEdittedLocation(record);
    setIsEditModalVisible(true);
  }

  function getCategoryFilters() {
    const categories = [];
    for (const location of locations) {
      if (categories.indexOf(location.category.name) == -1) {
        categories.push(location.category.name);
      }
    }

    return categories.map(category => { return { text: category, value: category } });
  }

  function handleCategorySelected(e) {
    setCategory(e.target.value);
  }

  function getCategoriesSection() {
    const categories = getCategories();

    return <Radio.Group value={category}>
      {
        categories.length > 0 &&
        categories.map(category => <Radio key={category.id} value={category.id} onClick={handleCategorySelected}>
          {category.name}
        </Radio>)
      }
    </Radio.Group>
  }

  function handleEditOk() {
    const id = edittedLocation.id;

    if (name && name != edittedLocation.name) {
      if (locations.some(location => location.name == name)) {
        setError('Location with the same name already exists');
        return;
      }
    }
    const newLocation = {
      id: edittedLocation.id,
      name: name ? name : edittedLocation.name,
      address: address ? address : edittedLocation.address,
      coordinates: coordinates ? coordinates : edittedLocation.coordinates,
      category: category ? category : edittedLocation.category.id
    };

    onLocationEditted(id, newLocation);
    resetStates();
  }

  function handleEditCancel() {
    resetStates();
  }

  function getEditModal() {
    if (!edittedLocation) {
      return;
    }

    return <Modal visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
      <div className='user-input'>
        <div className='label'>New Name</div>
        <Input placeholder='name'
          value={name}
          onChange={(e) => { setError(undefined); setName(e.target.value) }} />
      </div>
      <div className='user-input'>
        <div className='label'>New Address</div>
        <Input placeholder='address'
          value={address}
          onChange={(e) => { setError(undefined); setAddress(e.target.value) }} />
      </div>
      <div className='user-input'>
        <div className='label'>New Coordinates</div>
        <Input placeholder='coordinates'
          value={coordinates}
          onChange={(e) => { setError(undefined); setCoordinates(e.target.value) }} />
      </div>
      <div className='user-input'>
        <div className='label'>New Category</div>
        {getCategoriesSection()}
      </div>

      {
        error && <div className='error'>
          {error}
        </div>
      }
    </Modal>
  }

  return <div>
    <Table
      columns={columns}
      dataSource={locations} />

    {isEditModalVisible && getEditModal()}
  </div>
}