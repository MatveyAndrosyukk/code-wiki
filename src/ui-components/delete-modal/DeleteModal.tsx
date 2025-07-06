import React from 'react';
import Modal from "../../ui-components/modal/Modal";
import styles from '../../pages/main-page/Main.module.css';
import {FileType} from "../../types/file";

const DeleteModal = ({
                                deleteConfirm,
                                cancelDelete,
                                confirmDelete
                            }: any) => (
    <Modal isOpen={deleteConfirm.open} onClose={cancelDelete}>
        <div
            className={styles['createFolder__overlay']}
            style={deleteConfirm.open ? {padding: '7px 11px 7px'} : undefined}
        >
            <div className={styles['createFolder__form']}>
                <p className={styles['createFolder__form-deleteText']}>
                    {deleteConfirm.file?.type === FileType.Folder ? (
                        <>
                            Delete folder{" "}
                            <span className={styles['createFolder__highlightName']}>
                                "{deleteConfirm.file.name}"
                            </span>{" "}
                            and all its contents?
                        </>
                    ) : (
                        <>
                            Delete file{" "}
                            <span className={styles['createFolder__highlightName']}>
                                "{deleteConfirm.file?.name}"
                            </span>
                            ?
                        </>
                    )}
                </p>
                <div className={styles['createFolder__form-buttons']}>
                    <button
                        className={styles['createFolder-button']}
                        style={{background: '#D32F2F'}}
                        onClick={confirmDelete}
                    >
                        Delete
                    </button>
                    <button
                        className={styles['createFolder-button']}
                        style={{background: '#18A184'}}
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