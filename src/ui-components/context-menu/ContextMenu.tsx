import React, {FC, useEffect} from 'react';
import styles from './ContextMenu.module.css'
import {File} from "../../types/file";

interface ContextMenuProps {
    x: number;
    y: number;
    file: File;
    onClose: () => void;
    onCopyFile: (file: File) => void;
    onPasteFile: (id: number) => void;
}

const ContextMenu: FC<ContextMenuProps> = (
    {
        x,
        y,
        file,
        onClose,
        onCopyFile,
        onPasteFile
    }) => {

    useEffect(() => {
        const handleClickOutside = () => onClose();
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    return (
        <div>
            <ul
                className={styles['contextMenu']}
                style={{top: y, left: x}}
            >
                <li onClick={(e) => onCopyFile(file)}>Copy</li>
                <li onClick={(e) => onPasteFile(file.id)}>Paste</li>
                <li>Add File</li>
                <li>Add Folder</li>
            </ul>
        </div>
    );
};

export default ContextMenu;