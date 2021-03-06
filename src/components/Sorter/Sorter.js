import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Sorter.scss'

export default ({ onSort, sorters = [] }) => {

  const [sorterDirection, setSorterDirection] = useState(null);
  const [dataIndex, setDataIndex] = useState(null);
  const [isInitialRender, setInitialRender] = useState(true);
  const [iconFlag, setIconFlag] = useState([null, null]);

  const handleSorter = (dataIndex) => {
    const sortValues = new Map([
      [null, 'asc'],
      ['asc', 'desc'],
      ['desc', null]
    ]);

    // Changes the sorter direction depending on the previous value
    setSorterDirection(sortValues.get(sorterDirection));
    setDataIndex(dataIndex);
  }

  useEffect(() => {

    // This is a trick to not trigger useEffect on the initial render
    if (isInitialRender) return setInitialRender(false);

    // Payload that will go to service and filter the request
    const payload = {
      dataIndex,
      sorterDirection
    };

    // Sets the arrow icons flag to change the one correspondent to the data index and direction
    setIconFlag([dataIndex, sorterDirection]);

    // Calls the onSort function from parent component
    onSort(payload);

  }, [sorterDirection]);

  return (
    <div className='sorter-container'>
      <div className='sorter-title'>
        Sort by:
      </div>
      <div className='sorter-content'>
        {/* Renders sorter items based on the array of sorters = [] passed as props to the component */}
        {sorters.map((sorter, sorterIndex) => (
          <div key={sorterIndex} onClick={() => handleSorter(sorter.dataIndex)} className='sorter-item'>
            <div className='flex-row-center'>
              <div style={{ margin: '-5px 5px 0px 0px' }} className='flex-column-center'>
                <FontAwesomeIcon
                  className={iconFlag[0] === sorter.dataIndex && iconFlag[1] === 'asc' ? 'active-sorter-icon' : 'inactive-sorter-icon'}
                  style={{ marginBottom: '5px' }}
                  icon={['fas', 'arrow-up']}
                />
                <FontAwesomeIcon
                  className={iconFlag[0] === sorter.dataIndex && iconFlag[1] === 'desc' ? 'active-sorter-icon' : 'inactive-sorter-icon'}
                  icon={['fas', 'arrow-down']}
                />
              </div>
              <div className='label-container'>
                <div>
                  {sorter.icon}
                </div>
                <div className='sorter-icon-label'>
                  {sorter.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}