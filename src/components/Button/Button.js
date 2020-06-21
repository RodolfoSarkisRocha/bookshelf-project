import React, { useRef } from 'react';
import './Button.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClipLoader } from 'react-spinners';

export default props => {

  const { children, onClick, loading, loadingCss, className } = props;

  const buttonRef = useRef(null);

  // This adds the effect of pulsing to the button after it's clicked
  function handleClick() {
    const button = buttonRef.current;
    button.classList.add('pulse');
    setTimeout(() => {
      button.classList.remove('pulse');
    }, 1000)
    if (onClick && typeof onClick === 'function') onClick()
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={className ? `${className} btn-style` : 'btn-style'}
    >
      <div className='btn-prefix'>
        {loading ?
          <ClipLoader
            loading={true}
            color={loadingCss.color}
            size={loadingCss.size}
          /> :
          <FontAwesomeIcon icon={['fas', 'eye']} />
        }
      </div>
      <div className='btn-children'>
        {children}
      </div>
    </button>
  )
}