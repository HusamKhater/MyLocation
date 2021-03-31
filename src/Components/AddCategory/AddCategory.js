import {React} from 'react';
import {Button, Input} from 'antd'

export default function AddCategory({value, error, addCategory, setNewCatigoryName}) {
    return (
        <span className='add-category'>
            <Input 
                placeholder={'name'}
                value={value} 
                onChange={(e) => setNewCatigoryName(e.target.value)}/>
            <Button type="primary" onClick={addCategory}>Create Category</Button>
            { error && <div className='error'>{error}</div> }
        </span>
    )
}