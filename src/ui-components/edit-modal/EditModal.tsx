import React, {FC, useEffect} from 'react';
import Modal from "../../ui-components/modal/Modal";
import styles from './EditModal.module.css'
import modalStyles from '../modal/ModalContent.module.css'
import {FileType} from "../../types/file";
import {ActionType} from "../../utils/hooks/useFileTreeActions";
import {CreateFilePayload} from "../../store/thunks/createFileOnServer";

interface EditModalProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
    modalOpenState: { reason: ActionType | null, id: number | null, title: string | null };
    modalValue: string;
    setModalValue: (value: string) => void;
    modalInputRef: any;
    onModalConfirmByReason: (
        title: string,
        id: number | null,
        actionType: ActionType
    ) => void;
    copiedFile: CreateFilePayload | null;
    isNameConflictReason: () => boolean;
}

const EditModal: FC<EditModalProps> = (
    {
        isModalOpen,
        onCloseModal,
        modalOpenState,
        modalValue,
        setModalValue,
        modalInputRef,
        onModalConfirmByReason,
        copiedFile,
        isNameConflictReason,
    }) => {
    const [lengthError, setLengthError] = React.useState('');

    useEffect(() => {
        if (modalValue.length >= 20) {
            setLengthError('Name is too long');
        } else {
            setLengthError('')
        }
    }, [modalValue]);

    return <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
    >
        <div
            className={modalStyles['modal__overlay']}
        >
            <div className={modalStyles['modal__form']}>
                <div className={`${styles['modal__title']} ${modalStyles['modal__title']}`}>
                    {modalOpenState.title}
                </div>
                {isNameConflictReason() ?
                    lengthError ? (
                        <p className={`${modalStyles['modal__error']} ${styles['modal__error']}`}>
                            {lengthError}
                        </p>
                    ) : (
                        <p className={`${modalStyles['modal__error']} ${styles['modal__error']}`}>
                            {copiedFile?.type === FileType.Folder
                                ? "Folder with this name exists:"
                                : "File with this name exists:"}
                        </p>
                    ) :
                    (
                        lengthError ? (
                            <p className={`${modalStyles['modal__error']} ${styles['modal__error']}`}>
                                {lengthError}
                            </p>
                        ) : (
                            <p className={`${modalStyles['modal__error']} ${styles['modal__error']} ${modalStyles['modal__hidden']}`}>
                                {copiedFile?.type === FileType.Folder
                                    ? "Folder with this name exists:"
                                    : "File with this name exists:"}
                            </p>
                        )

                    )
                }
                <input
                    ref={modalInputRef}
                    type='text'
                    className={styles['modal__input']}
                    placeholder={"Enter the title"}
                    value={modalValue}
                    onChange={(e) => setModalValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (lengthError) return
                            onModalConfirmByReason(
                                modalValue,
                                modalOpenState.id,
                                modalOpenState.reason as ActionType
                            );
                        }
                    }}
                />
            </div>
        </div>
    </Modal>
};

export default EditModal;