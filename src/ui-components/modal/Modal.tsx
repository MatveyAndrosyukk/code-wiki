import React, { FC, CSSProperties } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    isNameConflictReason?: boolean;
    isCentered?: boolean;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, isNameConflictReason, isCentered }) => {
    if (!isOpen) return null;

    const contentStyle: CSSProperties = isCentered
        ? { position: 'relative' }
        : {
            position: 'absolute',
            top: isNameConflictReason ? '1px' : '4px',
        };

    return (
        <div className={styles['modal__overlay']} onClick={onClose}>
            <div
                className={styles['modal__content']}
                onClick={e => e.stopPropagation()}
                style={contentStyle}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;