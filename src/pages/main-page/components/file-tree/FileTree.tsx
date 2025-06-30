import React, {FC} from 'react';
import styles from './FileTree.module.css'
import fileTreeLock from './images/fileTree-lock.svg'
import FileList from "./components/file-list/FileList";
import {File} from "../../../../types/file";

interface FileTreeProps {
    files: File[];
    onFileClick: (id: number) => void;
    onCreateRootFolder: () => void;
    onCopyFile: (file: File) => void;
    onPasteFile: (id: number) => void;
}

const FileTree: FC<FileTreeProps> = (
    {
        files,
        onFileClick,
        onCreateRootFolder,
        onCopyFile,
        onPasteFile,
    }) => {
    return (
        <div className={styles['fileTree']}>
            <div className={styles['fileTree__content']}>
                <div className={styles['fileTree__buttons']}>
                    <div className={styles['fileTree__buttons-create']} onClick={onCreateRootFolder}>
                        Create a root folder
                    </div>
                    <div className={styles['fileTree__buttons-lock']}>
                        <img src={fileTreeLock} alt="Lock"/>
                    </div>
                </div>
                <div className={styles['fileTree__files']}>
                    <FileList
                        files={files}
                        onFileClick={onFileClick}
                        onCopyFile={onCopyFile}
                        onPasteFile={onPasteFile}
                    />
                </div>
            </div>
        </div>
    );
};

export default FileTree;