import React, { useRef } from 'react';
import './Button.scss';
import { ClipLoader } from 'react-spinners';

export default ({
  children,
  onClick,
  loading,
  loadingCss,
  className,
  type,
  icon,
  form }) => {

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

  const defaultClassName = loading ? 'btn-style btn-loading' : 'btn-style';

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      form={form}
      className={className ? `${className} ${defaultClassName}` : defaultClassName}
    >
      {(icon || loading) &&
        <div className='btn-prefix'>
          {loading ?
            <ClipLoader
              loading={true}
              color={loadingCss?.color}
              size={loadingCss?.size ?? 15}
            /> :
            icon ? icon : null
          }
        </div>
      }
      <div className='btn-children'>
        {children}
      </div>
    </button >
  )
}