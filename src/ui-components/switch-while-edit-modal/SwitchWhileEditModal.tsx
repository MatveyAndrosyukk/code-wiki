import React, {FC, useCallback, useContext} from 'react';
import modalStyles from '../modal/ModalContent.module.scss'
import styles from './SwitchWhileEditModal.module.scss'
import Modal from "../modal/Modal";
import {AppContext} from "../../context/AppContext";

interface SwitchWhileEditModalProps {
    onCancelEditedFileChange: (
        addedImages: string[],
        onSuccess: () => void) => void;
    addedImagesWhileEditing: string[];
    onSuccessCanceling: () => void;
}

const SwitchWhileEditModal: FC<SwitchWhileEditModalProps> = (
    {
        onCancelEditedFileChange,
        addedImagesWhileEditing,
        onSuccessCanceling,
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
        onCancelEditedFileChange(addedImagesWhileEditing, onSuccessCanceling)
    }, [addedImagesWhileEditing, handleConfirmSwitch, onCancelEditedFileChange, onSuccessCanceling])

    return (
        <Modal isOpen={isTryToSwitchWhileEditing}
               onClose={handleRejectSwitch}>
            <div
                className={`${modalStyles['modal__overlay']} ${styles['modal__overlay']}`}
            >
                <div className={modalStyles['modal__form']}>
                    <p
                        className={`${modalStyles['modal__title']} ${styles['modal__title']}`}
                    >
                        Are you sure that you want to open another file?
                        <br/>
                        You will lose all your unsaved changes.
                    </p>
                    <div className={modalStyles['modal__buttons']}>
                        <button
                            className={`${styles['modal__buttons-confirm']} ${styles['modal__button']}`}
                            onClick={confirmSwitchHandler}
                        >
                            Open
                        </button>
                        <button
                            className={`${styles['modal__buttons-reject']} ${styles['modal__button']}`}
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