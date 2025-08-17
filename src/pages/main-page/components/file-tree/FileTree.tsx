import React, {FC} from 'react';
import styles from './FileTree.module.css'
import fileTreeLock from './images/fileTree-lock.svg'
import FileList from "./components/file-list/FileList";
import {File} from "../../../../types/file";
import {ActionType} from "../../../../utils/useFileTreeActions";
import {CreateFilePayload} from "../../../../store/thunks/createFileOnServer";

interface FileTreeProps {
    files: CreateFilePayload[];
    copiedFile: CreateFilePayload | null;
    onTryToOpenFile: (id: number | null) => void;
    onOpenModalByReason: (args: { reason: ActionType, id: number | null }) => void;
    onCopyFile: (file: CreateFilePayload) => void;
    onPasteFile: (id: number | null) => void;
    onOpenDeleteModal: (file: CreateFilePayload) => void;
    isLoggedIn: boolean;
    setIsLoginModalOpen: (isOpen: boolean) => void;
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
        isLoggedIn,
        setIsLoginModalOpen,
    }) => {

    const handleCreateRootFolder = () => {
        isLoggedIn ? onOpenModalByReason({reason: ActionType.AddRootFolder, id: null}) : setIsLoginModalOpen(true);
    }

    return (
        <div className={styles['fileTree']}>
            <div className={styles['fileTree__content']}>
                <div className={styles['fileTree__buttons']}>
                    <div
                        className={styles['fileTree__buttons-create']}
                        onClick={() => handleCreateRootFolder()}
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