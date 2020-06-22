import React from 'react';
import { ClipLoader } from 'react-spinners';
import './Spin.scss'

export default props => {

  return (
    <div className='spinner-container'>
      <div className='spinner'>
        <ClipLoader />
      </div>
    </div>
  )
}