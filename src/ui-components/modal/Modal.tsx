import React, {FC} from 'react';
import styles from './Modal.module.css'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    isPasteConflict?: boolean;
}

const Modal:FC<ModalProps> = ({isOpen, onClose, children, isPasteConflict}) => {
    if (!isOpen) return null;
    return (
        <div className={styles['modal__overlay']} onClick={onClose}>
            <div
                className={styles['modal__content']}
                onClick={e => e.stopPropagation()}
                style={isPasteConflict ? { top: '1px' } : { top: '4px' }}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;