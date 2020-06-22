import React, { useState } from 'react';
import Button from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './GoToTopBtn.scss'

export default () => {

  const [showBtn, setShowBtn] = useState(false);

  function setScrollY() {
    setShowBtn(window.scrollY > 0);
  }

  window.addEventListener('scroll', setScrollY)

  function goTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  };

  return (
    showBtn && (
      <Button onClick={goTop} className='go-top-btn'>
        <FontAwesomeIcon className='go-top-btn-icn' icon={['fas', 'arrow-up']} />
      </Button>
    )
  )
}