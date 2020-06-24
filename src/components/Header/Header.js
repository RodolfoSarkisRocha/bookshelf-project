import React, { useRef, useEffect } from 'react';
import './Header.scss';

export default ({ children, extra, title }) => {

  const isMobile = window.innerWidth < 768;

  const headerRef = useRef(null);

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener('scroll', fixHeaderOnScroll)
    }
  }, [])

  function fixHeaderOnScroll() {
    if (!isMobile && headerRef) {
      const headerOffSetTop = headerRef.current.offsetTop;
      const isElementAtTop = window.pageYOffset > headerOffSetTop;
      if (isElementAtTop) headerRef.current.classList.add('fixed-header-desktop');
      else headerRef.current.classList.remove('fixed-header-desktop');
    }
  }

  function expandFilterContainer() {
    const filters = document.getElementById('filters');

    if (filters.className === 'filter-container') filters.classList.add('filter-container-visible');
    else filters.classList.remove('filter-container-visible')
  };

  return (
    <div ref={headerRef} style={{ marginBottom: '10px' }}>
      <div id='header' className='header-container'>
        <div className='title-container'>
          <div className='header-title'>{title}</div>
          <div className='extra-content' onClick={expandFilterContainer}>
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