import React, { Fragment, useEffect, useState } from 'react';
import './Modal.scss';

export default props => {

  const { title, footer, visible, width, onCancel } = props;
  const modalBody = props.children;
  const [modalClass, setModalClass] = useState('modal-overlay');

  // Function to close modal when user clicks outside of it
  function overlayClick(e) {
    const modalOverlay = document.getElementById('modal-wrapper');
    if (e.target === modalOverlay) {
      setModalClass('modal-overlay');
      onCancel()
    };
  };

  useEffect(() => {
    if (visible) setModalClass('modal-overlay visible');
    else setModalClass('modal-overlay');
  }, [visible]);

  return (
    <Fragment>
      <div id='modal-wrapper' className={modalClass} onClick={overlayClick}>
        <div className='modal' style={{ width }}>
          <div className='modal-header'>{title}</div>
          <div className='modal-body'>{modalBody}</div>
          <div className='modal-footer'>{footer}</div>
        </div>
      </div>
    </Fragment>
  );
};