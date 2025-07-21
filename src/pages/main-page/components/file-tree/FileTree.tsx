import React, {FC} from 'react';
import styles from './FileTree.module.css'
import fileTreeLock from './images/fileTree-lock.svg'
import FileList from "./components/file-list/FileList";
import {File} from "../../../../types/file";

interface FileTreeProps {
    files: File[]; // Все файлы.
    copiedFile: File | null; // Скопированный файл для логики отрисовки Paste.
    onTryToOpenFile: (id: number) => void; // Открывает файл и закрывает остальные.
    onOpenModalByReason: (args: { reason: string, id: number | null }) => void; // Открывает модальное окно с опр. причиной.
    onCopyFile: (file: File) => void; // Копирует файл.
    onPasteFile: (id: number) => void; // Вставляет файл.
    onOpenRenameModal: (file: File) => void;
    onOpenDeleteModal: (file: File) => void;
}

const FileTree: FC<FileTreeProps> = (
    {
        files,
        copiedFile,
        onTryToOpenFile,
        onOpenModalByReason,
        onCopyFile,
        onPasteFile,
        onOpenRenameModal,
        onOpenDeleteModal,
    }) => {
    return (
        <div className={styles['fileTree']}>
            <div className={styles['fileTree__content']}>
                <div className={styles['fileTree__buttons']}>
                    <div
                        className={styles['fileTree__buttons-create']}
                        onClick={() => onOpenModalByReason({reason: "addRoot", id: null})}
                    >
                        Create a root folder
                    </div>
                    <div className={styles['fileTree__buttons-block']}>
                        <img src={fileTreeLock} alt="Lock"/>
                    </div>
                </div>
                <div className={styles['fileTree__files']}>
                    <FileList
                        {...{
                            files,
                            copiedFile,
                            onTryToOpenFile,
                            onCopyFile,
                            onPasteFile,
                            onOpenModalByReason,
                            onOpenDeleteModal,
                            onOpenRenameModal
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FileTree;