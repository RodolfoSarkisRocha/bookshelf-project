import React from 'react';
import './TextArea.scss';

export default ({
  onChange,
  placeholder,
  name,
  maxLength = 1000,
  id,
  width,
  height,
  value = null
}) => {

  return (
    <div className='textarea-container'>
      <textarea
        placeholder={placeholder}
        value={value}
        name={name}
        maxLength={maxLength}
        onChange={onChange}
        id={id}
        className='textarea-style'
        style={{ width: width, height: height }}
      />
    </div>
  )
}