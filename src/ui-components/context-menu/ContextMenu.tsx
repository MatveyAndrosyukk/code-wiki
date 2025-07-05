import React, {FC, useEffect} from 'react';
import styles from './ContextMenu.module.css'
import {File, FileType} from "../../types/file";

interface ContextMenuProps {
    x: number; // Координаты Y куда нажали пкм.
    y: number; // Координаты X куда нажали пкм.
    file: File; // Файл, на который нажали пкм.
    copiedFile: File | null; // Скопированный файл для логики отрисовки Paste.
    onClose: () => void; // Закрывает контекстное меню.
    onOpenModal: (args: { reason: string, id: number | null }) => void; // Открывает модальное окно с опр. причиной.
    onCopyFile: (file: File) => void; // Копирует файл.
    onPasteFile: (id: number) => void; // Вставляет файл.
    onRenameFile: (file: File) => void;
    onDeleteFile: (file: File) => void;
}

const ContextMenu: FC<ContextMenuProps> = (
    {
        x,
        y,
        file,
        copiedFile,
        onClose,
        onCopyFile,
        onPasteFile,
        onDeleteFile,
        onRenameFile,
        onOpenModal
    }) => {

    // Добавляет слушатель события на все окно, который закрывает контекстное меню при нажатии на любое место
    // на экране.
    // Убирает слушаель, когда контекстное меню закрывается.
    useEffect(() => {
        const handleClickOutside = () => onClose();
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    return (
        <div>
            <ul className={styles['contextMenu']} style={{top: y, left: x}}>
                {
                    file.type === FileType.Folder && (
                        <>
                            {copiedFile && <li onClick={() => onPasteFile(file.id)}>Paste</li>}
                            <li onClick={() => onOpenModal({reason: 'addFile', id: file.id})}>Add File</li>
                            <li onClick={() => onOpenModal({reason: 'addFolder', id: file.id})}>Add Folder</li>
                        </>
                    )
                }
                <li onClick={() => onRenameFile(file)}>Rename</li>
                <li onClick={() => onCopyFile(file)}>Copy</li>
                <li className={styles['contextMenu__item-delete']} onClick={() => onDeleteFile(file)}>Delete</li>
            </ul>
        </div>
    );
};

export default ContextMenu;