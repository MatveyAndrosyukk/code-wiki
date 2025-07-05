import React, {FC} from 'react';
import styles from './FileTree.module.css'
import fileTreeLock from './images/fileTree-lock.svg'
import FileList from "./components/file-list/FileList";
import {File} from "../../../../types/file";

interface FileTreeProps {
    files: File[]; // Все файлы.
    copiedFile: File | null; // Скопированный файл для логики отрисовки Paste.
    onFileClick: (id: number) => void; // Открывает файл и закрывает остальные.
    onOpenModal: (args: {reason: string, id: number | null}) => void; // Открывает модальное окно с опр. причиной.
    onCopyFile: (file: File) => void; // Копирует файл.
    onPasteFile: (id: number) => void; // Вставляет файл.
    onRenameFile: (file: File) => void;
    onDeleteFile: (file: File) => void;
}

const FileTree: FC<FileTreeProps> = (
    {
        files,
        copiedFile,
        onFileClick,
        onOpenModal,
        onCopyFile,
        onPasteFile,
        onRenameFile,
        onDeleteFile,
    }) => {
    return (
        <div className={styles['fileTree']}>
            <div className={styles['fileTree__content']}>
                <div className={styles['fileTree__buttons']}>
                    <div className={styles['fileTree__buttons-create']} onClick={() => onOpenModal({reason: "addRoot",id: null})}>
                        Create a root folder
                    </div>
                    <div className={styles['fileTree__buttons-lock']}>
                        <img src={fileTreeLock} alt="Lock"/>
                    </div>
                </div>
                <div className={styles['fileTree__files']}>
                    <FileList
                        files={files}
                        copiedFile={copiedFile}
                        onFileClick={onFileClick}
                        onCopyFile={onCopyFile}
                        onPasteFile={onPasteFile}
                        onOpenModal={onOpenModal}
                        onDeleteFile={onDeleteFile}
                        onRenameFile={onRenameFile}
                    />
                </div>
            </div>
        </div>
    );
};

export default FileTree;