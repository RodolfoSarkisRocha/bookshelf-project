import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Sorter.scss'

export default props => {

  const { parentSorterFunction, filters } = props;

  const [sorterDirection, setSorterDirection] = useState(null);
  const [dataIndex, setDataIndex] = useState(null);
  const [isInitialRender, setInitialRender] = useState(true);
  const [iconFlag, setSorterIconFlag] = useState([null, null]);

  const handleSorter = (dataIndex) => {

    const sortValues = new Map([
      [null, 'ASC'],
      ['ASC', 'DESC'],
      ['DESC', null]
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
    setSorterIconFlag([dataIndex, sorterDirection]);

    parentSorterFunction(payload);
  }, [sorterDirection])

  return (
    <div className='filter-content'>
      {filters.map((filter, filterIndex) => (
        <div key={filterIndex} onClick={() => handleSorter(filter.dataIndex)} className='filter-item'>
          <div className='flex-row-center'>
            <div style={{ margin: '-5px 5px 0px 0px' }} className='flex-column-center'>
              <FontAwesomeIcon
                className={iconFlag[0] === filter.dataIndex && iconFlag[1] === 'ASC' ? 'active-sorter-icon' : 'inactive-sorter-icon'}
                style={{ marginBottom: '5px' }}
                icon={['fas', 'arrow-up']}
              />
              <FontAwesomeIcon
                className={iconFlag[0] === filter.dataIndex && iconFlag[1] === 'DESC' ? 'active-sorter-icon' : 'inactive-sorter-icon'}
                icon={['fas', 'arrow-down']}
              />
            </div>
            <div className='label-container'>
              <div>
                {filter.icon}
              </div>
              <div>
                {filter.name}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}