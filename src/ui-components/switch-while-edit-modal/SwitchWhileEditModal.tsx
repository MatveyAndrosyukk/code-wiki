import React, {FC, useCallback, useContext} from 'react';
import modalStyles from '../modal/ModalContent.module.scss'
import styles from './SwitchWhileEditModal.module.scss'
import Modal from "../modal/Modal";
import {AppContext} from "../../context/AppContext";

interface SwitchWhileEditModalProps {
    contentBeforeEdition: string;
    onCancelEditedFileChange: (
        addedImages: string[],
        contentBeforeEdition: string) => void;
    addedImagesWhileEditing: string[];
}

const SwitchWhileEditModal: FC<SwitchWhileEditModalProps> = (
    {
        onCancelEditedFileChange,
        addedImagesWhileEditing,
        contentBeforeEdition,
    }) => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Component can't be used without context");
    const {fileState} = context;

    const {
        isTryToSwitchWhileEditing,
        handleRejectSwitch,
        handleConfirmSwitch,
    } = fileState;

    const confirmSwitchHandler = useCallback(() => {
        handleConfirmSwitch()
        onCancelEditedFileChange(addedImagesWhileEditing, contentBeforeEdition)
    }, [addedImagesWhileEditing, contentBeforeEdition, handleConfirmSwitch, onCancelEditedFileChange])

    return (
        <Modal isOpen={isTryToSwitchWhileEditing}
               onClose={handleRejectSwitch}>
            <div
                className={`${modalStyles['modal__overlay']} ${styles['switch-modal__overlay']}`}
            >
                <div className={modalStyles['modal__form']}>
                    <p
                        className={`${modalStyles['modal__title']} ${styles['switch-modal__title']}`}
                    >
                        <div>Are you sure that you want to open another file?</div>
                        <div>You will lose all your unsaved changes.</div>
                    </p>
                    <div className={modalStyles['modal__buttons']}>
                        <button
                            className={`${styles['switch-modal__buttons-confirm']} ${styles['switch-modal__button']}`}
                            onClick={confirmSwitchHandler}
                        >
                            Open
                        </button>
                        <button
                            className={`${styles['switch-modal__buttons-reject']} ${styles['switch-modal__button']}`}
                            onClick={handleRejectSwitch}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SwitchWhileEditModal;