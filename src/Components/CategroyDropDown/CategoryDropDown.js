import {React} from 'react';
import { Button, Input } from 'antd';

export default function CategoryDropDown({setError, setCatigoryName, onClick, catigoryName, error}) {
    return <div className='category-dropdown'>
        <div style={{display: 'flex'}}>
            <Input 
                    placeholder={'name'}
                    value={catigoryName} 
                    onChange={(e) => {setError(undefined); setCatigoryName(e.target.value)}}
                    style={{marginRight: '5px'}}/>
            <Button type="primary" 
                    onClick={onClick}>Ok</Button>
        </div>
        <span className='error'>{error}</span>
    </div>
}