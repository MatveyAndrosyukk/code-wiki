import React, {FC, useEffect} from 'react';
import styles from './ContextMenu.module.css'
import {File, FileType} from "../../types/file";

interface ContextMenuProps {
    clickX: number;
    clickY: number;
    file: File;
    copiedFile: File | null;
    onCloseContextMenu: () => void;
    onOpenModalByReason: (args: { reason: string, id: number | null }) => void;
    onCopyFile: (file: File) => void;
    onPasteFile: (id: number) => void;
    onOpenRenameModal: (file: File) => void;
    onOpenDeleteModal: (file: File) => void;
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
        onOpenRenameModal,
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
                            <li onClick={() => onOpenModalByReason({reason: 'addFile', id: file.id})}>Add File</li>
                            <li onClick={() => onOpenModalByReason({reason: 'addFolder', id: file.id})}>Add Folder</li>
                        </>
                    )
                }
                <li onClick={() => onOpenRenameModal(file)}>Rename</li>
                <li onClick={() => onCopyFile(file)}>Copy</li>
                <li className={styles['contextMenu__item-delete']} onClick={() => onOpenDeleteModal(file)}>Delete</li>
            </ul>
        </div>
    );
};

export default ContextMenu;