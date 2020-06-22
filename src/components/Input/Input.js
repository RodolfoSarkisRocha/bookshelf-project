import React, { useRef, useEffect } from 'react';
import './Input.scss';

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
  errorMessage = 'This is a required field'
}) => {
  const inputRef = useRef(null);
  const inputContainerRef = useRef(null);

  useEffect(() => {
    if (error && inputRef) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputRef.current.classList.add('error');
    }
    else inputRef.current.classList.remove('error');
    if (error && inputContainerRef) {
      inputContainerRef.current.classList.add('shake');
    }
    else inputContainerRef.current.classList.remove('shake');
  }, [error])

  return (
    <div ref={inputContainerRef} className='input-container'>
      <input
        placeholder={placeholder}
        type={type}
        ref={inputRef}
        name={name}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        id={id}
        required={required}
        className='input-style'
        style={{ width: width }}
      />
      <div className='error-message'>
        {error && errorMessage}
      </div>
    </div>
  )
}