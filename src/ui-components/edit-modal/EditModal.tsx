import React, {FC, useContext, useEffect} from 'react';
import Modal from "../../ui-components/modal/Modal";
import styles from './EditModal.module.scss'
import modalStyles from '../modal/ModalContent.module.scss'
import {FileType} from "../../types/file";
import {AppContext} from "../../context/AppContext";
import {ActionType} from "../../utils/supporting-hooks/useModalActions";

const EditModal: FC = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Component can't be used without context");
    const {fileState} = context;
    const [lengthError] = React.useState('');

    const {
        modalValue,
        isModalOpen,
        modalOpenState,
        copiedFile,
        modalInputRef,
        modalError,
        setModalError,
        isNameConflictReason,
        setModalValue,
        handleCloseModal,
        handleConfirmModalByReason,
    } = fileState;

    useEffect(() => {
        if (modalValue.length >= 20) {
            setModalError('Name is too long');
        } else {
            setModalError('')
        }
    }, [modalValue, setModalError]);

    return <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
    >
        <div
            className={modalStyles['modal__overlay']}
        >
            <div className={modalStyles['modal__form']}>
                <div className={`${styles['edit-modal__title']} ${modalStyles['modal__title']}`}>
                    {modalOpenState.title}
                </div>
                {isNameConflictReason() ?
                    modalError ? (
                        <p className={`${modalStyles['modal__error']} ${styles['edit-modal__error']}`}>
                            {modalError}
                        </p>
                    ) : (
                        <p className={`${modalStyles['modal__error']} ${styles['edit-modal__error']}`}>
                            {copiedFile?.type === FileType.Folder
                                ? "Folder with this name exists"
                                : "File with this name exists"}
                        </p>
                    ) :
                    (
                        modalError ? (
                            <p className={`${modalStyles['modal__error']} ${styles['edit-modal__error']}`}>
                                {modalError}
                            </p>
                        ) : (
                            <p className={`${modalStyles['modal__error']} ${styles['edit-modal__error']} ${modalStyles['modal__hidden']}`}>
                                {copiedFile?.type === FileType.Folder
                                    ? "Folder with this name exists"
                                    : "File with this name exists"}
                            </p>
                        )

                    )
                }
                <input
                    ref={modalInputRef}
                    type='text'
                    className={styles['edit-modal__input']}
                    placeholder={"Enter the title"}
                    value={modalValue}
                    onChange={(e) => setModalValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (lengthError) return;
                            handleConfirmModalByReason({
                                title: modalValue,
                                id: modalOpenState.id,
                                reason: modalOpenState.reason as ActionType
                            });
                        }
                    }}
                />
            </div>
        </div>
    </Modal>
};

export default EditModal;