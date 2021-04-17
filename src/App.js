import './App.css';
import Category from './Containers/Category'
import Location from './Containers/Location'
import { Menu } from 'antd';
import { useState } from 'react';


function App() {

  const [current, setCurrent] = useState('categroy');

  function handleClick(e) {
    setCurrent(e.key);
  }

  return (
    <div className="App height">

      <div className='view'>
        {
          current == 'categroy' && <Category />
        }
        {
          current == 'location' && <Location />
        }
      </div>

      <Menu onClick={handleClick} selectedKeys={[current]} mode='horizontal'>
        <Menu.Item key='categroy'>Categories</Menu.Item>
        <Menu.Item key='location'>Locations</Menu.Item>
      </Menu>
    </div>
  );
}

export default App;