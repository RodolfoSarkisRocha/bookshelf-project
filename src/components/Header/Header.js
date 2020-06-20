import React from 'react';
import './Header.scss';

export default ({ children, extra, title }) => {

  function expandFilterContainer() {
    const filters = document.getElementById('filters');

    if (filters.className === 'filter-container') filters.classList.add('filter-container-visible');
    else filters.classList.remove('filter-container-visible')
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <div id='header' className='header-container'>
        <div className='title-container'>
          <div>{title}</div>
          <div onClick={expandFilterContainer}>
            {extra}
          </div>
        </div>
      </div>
      <div id='filters' className='filter-container'>
        {children}
      </div>
    </div>
  );
};