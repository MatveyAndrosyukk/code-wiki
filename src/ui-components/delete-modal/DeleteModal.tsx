import React from 'react';
import Modal from "../../ui-components/modal/Modal";
import modalStyles from '../modal/ModalContent.module.css'
import styles from './DeleteModal.module.css'
import {FileType} from "../../types/file";

const DeleteModal = ({
                                deleteConfirm,
                                cancelDelete,
                                confirmDelete
                            }: any) => (
    <Modal isOpen={deleteConfirm.open} onClose={cancelDelete}>
        <div
            className={modalStyles['modal__overlay']}
            style={deleteConfirm.open ? {padding: '7px 11px 7px'} : undefined}
        >
            <div className={modalStyles['modal__form']}>
                <p className={modalStyles['modal__text']}>
                    {deleteConfirm.file?.type === FileType.Folder ? (
                        <>
                            Delete folder{" "}
                            <span className={styles['modal__text-highlighted']}>
                                "{deleteConfirm.file.name}"
                            </span>{" "}
                            and all its contents?
                        </>
                    ) : (
                        <>
                            Delete file{" "}
                            <span className={styles['modal__text-highlighted']}>
                                "{deleteConfirm.file?.name}"
                            </span>
                            ?
                        </>
                    )}
                </p>
                <div className={modalStyles['modal__buttons']}>
                    <button
                        className={styles['modal__buttons-delete']}
                        onClick={confirmDelete}
                    >
                        Delete
                    </button>
                    <button
                        className={styles['modal__buttons-cancel']}
                        onClick={cancelDelete}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </Modal>
);

export default DeleteModal;