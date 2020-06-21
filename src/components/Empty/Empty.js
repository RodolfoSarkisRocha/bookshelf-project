import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Empty.scss'

export default ({ text = 'No data found' }) => {
  return (
    <div className='empty-container'>
      <div><FontAwesomeIcon className='empty-icon' icon={['fas', 'archive']} /></div>
      <div>{text}</div>
    </div>
  )
}