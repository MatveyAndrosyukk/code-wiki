import React, {FC} from 'react';
import Modal from "../../ui-components/modal/Modal";
import modalStyles from '../modal/ModalContent.module.css'
import styles from './DeleteModal.module.css'
import {File, FileType} from "../../types/file";
import {CreateFilePayload} from "../../store/thunks/createFileOnServer";

interface DeleteModalProps {
    deleteModalState: { open: boolean, file: CreateFilePayload | null };
    onCancelDeleteFile: () => void;
    onDeleteFile: () => void;
}

const DeleteModal:FC<DeleteModalProps> = (
    {
        deleteModalState,
        onCancelDeleteFile,
        onDeleteFile
    }: any) => (
    <Modal isOpen={deleteModalState.open} onClose={onCancelDeleteFile}>
        <div
            className={modalStyles['modal__overlay']}
            style={deleteModalState.open ? {padding: '7px 11px 7px'} : undefined}
        >
            <div className={modalStyles['modal__form']}>
                <p className={modalStyles['modal__text']}>
                    {deleteModalState.file?.type === FileType.Folder ? (
                        <>
                            Delete folder{" "}
                            <span className={styles['modal__text-highlighted']}>
                                "{deleteModalState.file.name}"
                            </span>{" "}
                            and all its contents?
                        </>
                    ) : (
                        <>
                            Delete file{" "}
                            <span className={styles['modal__text-highlighted']}>
                                "{deleteModalState.file?.name}"
                            </span>
                            ?
                        </>
                    )}
                </p>
                <div className={modalStyles['modal__buttons']}>
                    <button
                        className={styles['modal__buttons-delete']}
                        onClick={onDeleteFile}
                    >
                        Delete
                    </button>
                    <button
                        className={styles['modal__buttons-cancel']}
                        onClick={onCancelDeleteFile}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </Modal>
);

export default DeleteModal;