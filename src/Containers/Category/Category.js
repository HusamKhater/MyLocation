import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header';
import { Button, Modal, Tooltip, Dropdown, Card, Empty } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import CategoryDropDown from '../../Components/CategroyDropDown';
import { getCategories, getLocations } from '../../Utils/utils';


const { Meta } = Card;


export default function Category(props) {

    const [categories, setCategories] = useState(getCategories());
    const [newCatigoryName, setNewCatigoryName] = useState(undefined);
    const [edittedCatigoryName, setEdittedCatigoryName] = useState(undefined);
    const [newError, setNewError] = useState("");
    const [editError, setEditError] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    
    useEffect( () => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories])
    
    function addCategory() {
        const validationResult = validateCategory(newCatigoryName);
        if (!validationResult.valid) {
            setNewError(validationResult.message);
            return;
        }

        setCategories([...categories, {id: uuidv4(), name: newCatigoryName}]);
        setNewCatigoryName("");
    }

    function editCategory() {
        const validationResult = validateCategory(edittedCatigoryName);
        if (!validationResult.valid) {
            setEditError(validationResult.message);
            return;
        }

        const editedCategories = categories.map((value) => {
            return value.id == selectedCategoryId ? {id: value.id, name: edittedCatigoryName} : value;
        })

        setEdittedCatigoryName("");
        setCategories(editedCategories);
        setSelectedCategoryId(undefined);
    }

    function validateCategory(name) {
        if (!name) {
            return {
                valid: false,
                message: "Missing Category Name",
            }
        }

        if (isCategoryNameExists(name)) {
            return {
                valid: false,
                message: `Category with name ${name} already exists.`,
            }
        }

        return {
            valid: true,
            message: '',
        };
    }

    function isCategoryNameExists(name) {
        return categories?.length > 0 && categories?.some((categrory) => categrory.name == name)
    }
    
    function deleteCategory() {
        const filteredCategories = categories.filter((value) => value.id != selectedCategoryId);
        setSelectedCategoryId(undefined);
        setCategories(filteredCategories);
        setIsDeleteModalVisible(false)
    }

    function handleCategorySelect(id) {
        if (selectedCategoryId == id) {
            setSelectedCategoryId(undefined);
        } else {
            setSelectedCategoryId(id);
        }
    }

    const addCategoryDropDown = <CategoryDropDown 
                                    setError={setNewError} 
                                    setCatigoryName={setNewCatigoryName} 
                                    onClick={addCategory} 
                                    catigoryName={newCatigoryName} 
                                    error={newError} />;

    const editCategoryDropDown = <CategoryDropDown 
                                    setError={setEditError} 
                                    setCatigoryName={setEdittedCatigoryName} 
                                    onClick={editCategory} 
                                    catigoryName={edittedCatigoryName} 
                                    error={editError} />;

    function getSelectedCategoryDetails() {
        let selectedCategory = undefined;
        for (let category of categories) {
            if (category.id == selectedCategoryId) {
                selectedCategory = category;
                break;
            }
        }

        if (!selectedCategory) {
            return <></>;
        }

        return <div>
            <span>Name: {selectedCategory.name}</span>
        </div>
    }

    function showDeleteModal() {
        setIsDeleteModalVisible(true);
    }

    const handleDeleteOk = () => {
        deleteCategory();
    }

    function handleDeleteCancel() {
        setIsDeleteModalVisible(false);
    }

    function getDeleteCategoryModal() {
        if (isCategoryInUse()) {
            return <div className='delete-category'>
                <WarningOutlined />
                 The selected category is used, Please delete usages first
            </div>
        }

        return <div>
            Are you sure?
        </div>
    }

    function isCategoryInUse() {
        const locations = getLocations();
        return locations.some(location => location.category == selectedCategoryId);
    }

    return <div className='categroies height'>
        <Header title={'Categories'}/>

        <div className='topbar'>
            <Tooltip title="Add New Category">
                <Dropdown   overlay={addCategoryDropDown} 
                            trigger={['click']} >
                    <Button type="primary" 
                        icon={<PlusOutlined />}> 
                        Add
                    </Button>
                </Dropdown>
                
            </Tooltip>
            <Tooltip title="View">
                <Button icon={<EyeOutlined />} 
                        disabled={selectedCategoryId == undefined}
                        onClick={showModal}> 
                    View
                </Button>
            </Tooltip>
            <Tooltip title="Edit">
                <Dropdown   disabled={selectedCategoryId == undefined} 
                            overlay={editCategoryDropDown} 
                            trigger={['click']} >
                    <Button icon={<EditOutlined />}> 
                        Edit 
                    </Button>
                </Dropdown>
            </Tooltip>
            <Tooltip title="Delete">
                <Button icon={<DeleteOutlined />} 
                        disabled={selectedCategoryId == undefined} 
                        onClick={showDeleteModal}
                        danger> 
                    Delete 
                </Button>
            </Tooltip>
        </div>     

        {
            categories.length == 0 && 
                <Empty
                    className='empty'
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    description={ 
                        <>
                            <div className='title'> No Categories Yet </div>
                            <div className='subtitle'>Start by adding a new category</div>
                        </> 
                    }
                />
        }

        <Modal  title="Category Details" 
                visible={isModalVisible} 
                onOk={handleOk}
                onCancel={handleCancel}
                cancelButtonProps={{ style: { display: 'none' } }}>
            <p>{getSelectedCategoryDetails()}</p>
        </Modal>

        <Modal title='Delete Category'
                visible={isDeleteModalVisible}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{disabled: isCategoryInUse()}}>
            <p>{getDeleteCategoryModal()}</p>
        </Modal>

        {
            categories.length > 0 && <div className="categories-list">
                {
                    categories.map((category) => (
                        <Card   style={{ maxWidth: 240 }} 
                                key={category.id}
                                className={`category card${selectedCategoryId == category.id ? '-selected' : ''}`} 
                                onClick={(e) => handleCategorySelect(category.id)}>
                        <Meta
                          title={category.name}
                        />
                      </Card>
                    ))
                }
            </div>
        }

    </div>
}