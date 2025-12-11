import React, {FC, useContext, useEffect} from 'react';
import styles from './ContextMenu.module.scss'
import {File, FileType} from "../../types/file";
import {AppContext} from "../../context/AppContext";
import {ActionType} from "../../utils/supporting-hooks/useModalActions";

interface ContextMenuProps {
    clickX: number;
    clickY: number;
    file: File;
    onCloseContextMenu: () => void;
}

const ContextMenu: FC<ContextMenuProps> = (
    {
        clickX,
        clickY,
        file,
        onCloseContextMenu,
    }) => {
    const context = useContext(AppContext);
    if (!context) throw new Error("MainPage must be used within AppProvider");
    const {fileState, viewedUser} = context;

    const {
        copiedFile,
        handlePasteFile,
        handleOpenModalByReason,
        handleCopyFile,
        handleOpenDeleteModal,
    } = fileState;

    useEffect(() => {
        const handleClickOutside = () => onCloseContextMenu();
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onCloseContextMenu]);

    return (
        <div>
            <ul className={styles['context-menu']}
                style={{top: clickY, left: clickX}}>
                {file.type === FileType.Folder && (
                    <>
                        {copiedFile && (
                            <li className={styles['context-menu__item']}
                                onClick={() => handlePasteFile(file.id)}>
                                Paste
                            </li>
                        )}
                        <li className={styles['context-menu__item']}
                            onClick={() => handleOpenModalByReason({
                                reason: ActionType.AddFile,
                                id: file.id,
                                title: "Add File"
                            })}>
                            Add File
                        </li>
                        <li className={styles['context-menu__item']}
                            onClick={() => handleOpenModalByReason({
                                reason: ActionType.AddFolder,
                                id: file.id,
                                title: 'Add Folder'
                            })}>
                            Add Folder
                        </li>
                    </>
                )}
                <li className={styles['context-menu__item']}
                    onClick={() => handleOpenModalByReason({
                        reason: ActionType.RenameFile,
                        id: file.id,
                        title: "Rename file"
                    })}>
                    Rename
                </li>
                <li className={styles['context-menu__item']}
                    onClick={() => handleCopyFile(file)}>
                    Copy
                </li>
                <li className={`${styles['context-menu__item']} ${styles['context-menu__item-delete']}`}
                    onClick={() => handleOpenDeleteModal(file, viewedUser)}>
                    Delete
                </li>
            </ul>
        </div>
    );
};

export default ContextMenu;