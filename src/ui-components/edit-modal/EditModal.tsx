import React from 'react';
import Modal from "../../ui-components/modal/Modal";
import styles from './EditModal.module.css'
import modalStyles from '../modal/ModalContent.module.css'
import {FileType} from "../../types/file";

const EditModal = ({
                       isModalOpen,
                       handleCloseModal,
                       isPasteConflict,
                       modalState,
                       modalValue,
                       setModalValue,
                       addFolderInputRef,
                       handleCreate,
                       copiedFile
                   }: any) => (
    <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isPasteConflict={isPasteConflict}
    >
        <div
            className={modalStyles['modal__overlay']}
            style={isPasteConflict
                ? {padding: '7px 17px 12px 17px'}
                : undefined
            }
        >
            <div className={modalStyles['modal__form']}>
                {modalState.reason === 'resolvePasteConflict' && (
                    <p className={modalStyles['modal__text']}>
                        {copiedFile?.type === FileType.Folder
                            ? "Folder with this name exists. Enter another name:"
                            : "File with this name exists. Enter another name:"}
                    </p>
                )}
                <input
                    ref={addFolderInputRef}
                    type='text'
                    className={styles['modal__input']}
                    placeholder={"Enter the title"}
                    value={modalValue}
                    onChange={(e) => setModalValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleCreate(
                                modalValue,
                                modalState.id,
                                modalState.reason as 'addRoot' | 'addFolder' | 'addFile' | 'resolvePasteConflict'
                            );
                        }
                    }}
                />
            </div>
        </div>
    </Modal>
);

export default EditModal;