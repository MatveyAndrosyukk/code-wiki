import React, {FC} from 'react';
import modalStyles from '../modal/ModalContent.module.css'
import styles from './SwitchWhileEditModal.module.css'
import Modal from "../modal/Modal";

interface SwitchWhileEditModalProps {
    isTryToSwitchWhileEditing: boolean;
    onRejectSwitch: () => void;
    onConfirmSwitch: () => void;
}

const SwitchWhileEditModal: FC<SwitchWhileEditModalProps> = (
    {
        isTryToSwitchWhileEditing,
        onRejectSwitch,
        onConfirmSwitch,
    }
) => {
    return (
        <Modal isOpen={isTryToSwitchWhileEditing} onClose={onRejectSwitch}>
            <div className={modalStyles['modal__overlay']}>
                <div className={modalStyles['modal__form']}>
                    <p className={modalStyles['modal__text']}>
                        Are you sure that you want to open another file?
                        <br/>
                        You will lose all your unsaved changes.
                    </p>
                    <div className={modalStyles['modal__buttons']}>
                        <button
                            className={styles['modal__buttons-confirm']}
                            onClick={onConfirmSwitch}
                        >
                            Open file
                        </button>
                        <button
                            className={styles['modal__buttons-reject']}
                            onClick={onRejectSwitch}
                        >
                            Stay
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SwitchWhileEditModal;