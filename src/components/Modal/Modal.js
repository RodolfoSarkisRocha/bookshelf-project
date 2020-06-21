import React, { Fragment, useEffect, useState, useRef } from 'react';
import './Modal.scss';

export default ({ title, footer, visible, width, onCancel, children }) => {

  const modalBody = children;
  const [modalClass, setModalClass] = useState('modal-overlay');
  const modalRef = useRef(null);

  // Function to close modal when user clicks outside of it, onCancel prop is necessary to close the modal.
  function overlayClick(e) {
    const modalOverlay = modalRef;
    if (e.target === modalOverlay.current) {
      if (onCancel && typeof onCancel === 'function') onCancel()
      else return null
      setModalClass('modal-overlay');
    };
  };

  useEffect(() => {
    if (visible) setModalClass('modal-overlay visible');
    else setModalClass('modal-overlay');
  }, [visible]);

  return (
    <Fragment>
      <div ref={modalRef} className={modalClass} onClick={overlayClick}>
        <div className='modal' style={{ width }}>
          {title && <div className='modal-header'>{title}</div>}
          <div className='modal-body'>{modalBody}</div>
          {footer && <div className='modal-footer'>{footer}</div>}
        </div>
      </div>
    </Fragment>
  );
};