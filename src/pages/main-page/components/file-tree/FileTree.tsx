import React, {FC} from 'react';
import styles from './FileTree.module.css'
import fileTreeLock from './images/fileTree-lock.svg'
import FileList from "./components/file-list/FileList";
import {File} from "../../../../types/file";
import {ActionType} from "../../utils/useFileTreeActions";

interface FileTreeProps {
    files: File[];
    copiedFile: File | null;
    onTryToOpenFile: (id: number) => void;
    onOpenModalByReason: (args: { reason: ActionType, id: number | null }) => void;
    onCopyFile: (file: File) => void;
    onPasteFile: (id: number) => void;
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
        onOpenDeleteModal,
    }) => {
    return (
        <div className={styles['fileTree']}>
            <div className={styles['fileTree__content']}>
                <div className={styles['fileTree__buttons']}>
                    <div
                        className={styles['fileTree__buttons-create']}
                        onClick={() => onOpenModalByReason({reason: ActionType.AddRootFolder, id: null})}
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
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FileTree;