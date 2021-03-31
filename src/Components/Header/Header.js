import { React } from "react";
import {Divider} from 'antd'

export default function Header({title}) {
    return <div className='header'>
        <div className='title'>{title}</div>
        <Divider plain/>
    </div>
}