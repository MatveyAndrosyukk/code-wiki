import React from 'react';
import {File} from "../../../../../../types/file";
import styles from './FileList.module.css'
import {useDispatch} from "react-redux";
import {toggleFolder} from "../../../../../../store/slices/fileTreeSlice";
import ContextMenu from "../../../../../../ui-components/context-menu/ContextMenu";
import useContextMenuActions from "./utils/useContextMenuActions";
import FileListView from "./components/FileListView";

interface FileListProps {
    files: File[]; // Все файлы.
    copiedFile: File | null; // Скопированный файл для логики отрисовки Paste.
    onTryToSwitchFile: (id: number) => void; // Открывает файл и закрывает остальные.
    onOpenModal: (args: {reason: string, id: number | null}) => void; // Открывает модальное окно с опр. причиной.
    onCopyFile: (file: File) => void; // Копирует файл.
    onPasteFile: (id: number) => void; // Вставляет файл.
    onDeleteFile: (file: File) => void;
    onRenameFile: (file: File) => void;
}

const FileList: React.FC<FileListProps> = (
    {
        files,
        copiedFile,
        onTryToSwitchFile,
        onCopyFile,
        onPasteFile,
        onOpenModal,
        onDeleteFile,
        onRenameFile,
    }
) => {
    const contextMenuActions = useContextMenuActions()
    const dispatch = useDispatch();


    // Открывает / закрывает папку (также ее children).
    const onFolderClick = (id: number) => {
        dispatch(toggleFolder({id}))
    };

    return <div className={styles['fileList']}>
        <FileListView
            nodes={files}
            onTryToSwitchFile={onTryToSwitchFile}
            onFolderClick={onFolderClick}
            contextMenuActions={contextMenuActions}
        />
        {contextMenuActions.contextMenu.visible && contextMenuActions.contextMenu.file && (
            <ContextMenu
                x={contextMenuActions.contextMenu.x}
                y={contextMenuActions.contextMenu.y}
                file={contextMenuActions.contextMenu.file}
                onCloseContextMenu={contextMenuActions.onCloseContextMenu}
                {...{
                    copiedFile,
                    onCopyFile,
                    onPasteFile,
                    onOpenModal,
                    onRenameFile,
                    onDeleteFile
                }}
            />
        )}
    </div>;
};

export default FileList;