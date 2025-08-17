import React, {FC, useEffect} from 'react';
import styles from './ContextMenu.module.css'
import {File, FileType} from "../../types/file";
import {ActionType} from "../../utils/useFileTreeActions";
import {CreateFilePayload} from "../../store/thunks/createFileOnServer";

interface ContextMenuProps {
    clickX: number;
    clickY: number;
    file: CreateFilePayload;
    copiedFile: CreateFilePayload | null;
    onCloseContextMenu: () => void;
    onOpenModalByReason: (args: { reason: ActionType, id: number | null }) => void;
    onCopyFile: (file: CreateFilePayload) => void;
    onPasteFile: (id: number | null) => void;
    onOpenDeleteModal: (file: CreateFilePayload) => void;
}

const ContextMenu: FC<ContextMenuProps> = (
    {
        clickX,
        clickY,
        file,
        copiedFile,
        onCloseContextMenu,
        onCopyFile,
        onPasteFile,
        onOpenDeleteModal,
        onOpenModalByReason
    }) => {

    useEffect(() => {
        const handleClickOutside = () => onCloseContextMenu();
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onCloseContextMenu]);

    return (
        <div>
            <ul className={styles['contextMenu']} style={{top: clickY, left: clickX}}>
                {
                    file.type === FileType.Folder && (
                        <>
                            {copiedFile && <li onClick={() => onPasteFile(file.id)}>Paste</li>}
                            <li onClick={() => onOpenModalByReason({reason: ActionType.AddFile, id: file.id})}>Add File</li>
                            <li onClick={() => onOpenModalByReason({reason: ActionType.AddFolder, id: file.id})}>Add Folder</li>
                        </>
                    )
                }
                <li onClick={() => onOpenModalByReason({reason: ActionType.RenameFile, id: file.id})}>Rename</li>
                <li onClick={() => onCopyFile(file)}>Copy</li>
                <li className={styles['contextMenu__item-delete']} onClick={() => onOpenDeleteModal(file)}>Delete</li>
            </ul>
        </div>
    );
};

export default ContextMenu;