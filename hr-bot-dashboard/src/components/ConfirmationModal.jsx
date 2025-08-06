import React from 'react';
import styles from './ConfirmationModal.module.css';

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.actions}>
          <button onClick={onConfirm} className={styles.confirmButton}>Так</button>
          <button onClick={onClose} className={styles.cancelButton}>Ні</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
