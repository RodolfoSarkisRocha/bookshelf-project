import React from 'react';
import './Button.scss';

export default props => {

  const {children, onClick} = props;

  return (
    <button onClick={onClick} className='btn-style'>
      {children}
    </button>
  )
}