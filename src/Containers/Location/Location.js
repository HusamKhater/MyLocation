import {React, useState, useEffect} from 'react';
import Header from '../../Components/Header'
import { Button, Modal, Tooltip, Dropdown, Empty } from 'antd';
import AddLocation from '../../Components/AddLocation';
import LocationsTable from '../../Components/LocationsTable'
import { getCategoriesMap } from '../../Utils/utils';


export default function Location(props) {

    const [locations, setLocations] = useState(getLocationsDefaultState());

    function getLocationsDefaultState() {
        const categories = localStorage.getItem('locations');
        return categories ? JSON.parse(categories) : [];
    }

    useEffect( () => {
        localStorage.setItem('locations', JSON.stringify(locations));
    }, [locations]);

    function isValidNewLocation(newLocation) {
        if (locations.some(location => location.name == newLocation.name)) {
            return {
                isValid: false, 
                error: 'Location with the same name already exists'
            }
        }

        return {
            isValid: true
        }
    }

    function onLocationAdded(newLocation) {
        setLocations([...locations, newLocation])
    }

    function getLocationsArray() {
        const locationsArray = [];
        const categoriesMap = getCategoriesMap();
        for (const location of locations) {
            const tmpLocation = {...location};
            tmpLocation['category'] = {
                id: location.category,
                name: categoriesMap[location.category]
            }
            locationsArray.push(tmpLocation)
        }
        return locationsArray;
    }

    function onLocationDelete(locationId) {
        setLocations(locations.filter(location => location.id != locationId))
    }

    function onLocationEditted(id, newLocation) {
        const oldLocation = locations.filter(location => location.id == id);
        setLocations(locations.map(location => {
            if (location.id == id) {
                return newLocation;
            } 
            return location
        }))
    }

    return <div className='locations height'>
        <Header title={'Locations'}/>

        <div className='topbar'>
            <AddLocation onLocationAdded={onLocationAdded} isValidNewLocation={isValidNewLocation}/>
        </div>

        {
            locations.length == 0 && 
                <Empty
                    className='empty'
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    description={ 
                        <>
                            <div className='title'> No Locations Yet </div>
                            <div className='subtitle'>Start by adding a new location</div>
                        </> 
                    }
                />
        }

        {
            locations.length > 0 && 
                <LocationsTable locations={getLocationsArray()} onLocationDelete={onLocationDelete} onLocationEditted={onLocationEditted}/>
        }

    </div>
}