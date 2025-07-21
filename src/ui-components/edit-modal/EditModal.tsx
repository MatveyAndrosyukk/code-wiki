import React, {FC} from 'react';
import Modal from "../../ui-components/modal/Modal";
import styles from './EditModal.module.css'
import modalStyles from '../modal/ModalContent.module.css'
import {File, FileType} from "../../types/file";

interface EditModalProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
    isPasteConflictReason: boolean;
    modalOpenState: { reason: string, id: number | null };
    modalValue: string;
    setModalValue: (value: string) => void;
    modalInputRef: any;
    onModalConfirmByReason: (
        title: string,
        id: number | null,
        actionType: 'addRoot' | 'addFolder' | 'addFile' | 'resolvePasteConflict'
    ) => void;
    copiedFile: File | null;
}

const EditModal: FC<EditModalProps> = (
    {
        isModalOpen,
        onCloseModal,
        isPasteConflictReason,
        modalOpenState,
        modalValue,
        setModalValue,
        modalInputRef,
        onModalConfirmByReason,
        copiedFile
    }) => (
    <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        isPasteConflictReason={isPasteConflictReason}
    >
        <div
            className={modalStyles['modal__overlay']}
            style={isPasteConflictReason
                ? {padding: '7px 17px 12px 17px'}
                : undefined
            }
        >
            <div className={modalStyles['modal__form']}>
                {isPasteConflictReason && (
                    <p className={modalStyles['modal__text']}>
                        {copiedFile?.type === FileType.Folder
                            ? "Folder with this name exists. Enter another name:"
                            : "File with this name exists. Enter another name:"}
                    </p>
                )}
                <input
                    ref={modalInputRef}
                    type='text'
                    className={styles['modal__input']}
                    placeholder={"Enter the title"}
                    value={modalValue}
                    onChange={(e) => setModalValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onModalConfirmByReason(
                                modalValue,
                                modalOpenState.id,
                                modalOpenState.reason as 'addRoot' | 'addFolder' | 'addFile' | 'resolvePasteConflict'
                            );
                        }
                    }}
                />
            </div>
        </div>
    </Modal>
);

export default EditModal;