import React, { useRef, useEffect } from 'react';
import './Select.scss';

export default ({
  onChange,
  placeholder,
  type,
  name,
  id,
  required = false,
  width,
  value = null,
  maxLength = 150,
  error = false,
  children,
  errorMessage = 'This is a required field'
}) => {
  const selectRef = useRef(null);
  const selectContainerRef = useRef(null);

  useEffect(() => {

    // Adding the error and scroll into the component with error
    if (error) {
      if (selectRef && selectContainerRef) {
        selectRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        selectRef.current.classList.add('error');
        selectContainerRef.current.classList.add('shake');
      }
    } else {
      selectRef.current.classList.remove('error');
      selectContainerRef.current.classList.remove('shake');
    }
  }, [error]);

  return (
    <div ref={selectContainerRef} className='select-container'>
      <select
        placeholder={placeholder}
        type={type}
        ref={selectRef}
        name={name}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        id={id}
        required={required}
        className='select-style'
        style={{ width: width }}
      >
        {children}
      </select>
      <div className='error-message'>
        {error && errorMessage}
      </div>
    </div>
  )
}