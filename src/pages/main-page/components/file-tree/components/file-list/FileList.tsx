import React from 'react';
import {File} from "../../../../../../types/file";
import styles from './FileList.module.css'
import {useDispatch} from "react-redux";
import {toggleFolder} from "../../../../../../store/slices/fileTreeSlice";
import ContextMenu from "../../../../../../ui-components/context-menu/ContextMenu";
import useContextMenuActions from "./utils/useContextMenuActions";
import FileListView from "./components/FileListView";
import {ActionType} from "../../../../utils/useFileTreeActions";

interface FileListProps {
    files: File[];
    copiedFile: File | null;
    onTryToOpenFile: (id: number) => void;
    onOpenModalByReason: (args: {reason: ActionType, id: number | null}) => void;
    onCopyFile: (file: File) => void;
    onPasteFile: (id: number) => void;
    onOpenDeleteModal: (file: File) => void;
}

const FileList: React.FC<FileListProps> = (
    {
        files,
        copiedFile,
        onTryToOpenFile,
        onCopyFile,
        onPasteFile,
        onOpenModalByReason,
        onOpenDeleteModal,
    }
) => {
    const contextMenuActions = useContextMenuActions()
    const dispatch = useDispatch();

    const onFolderClick = (id: number) => {
        dispatch(toggleFolder({id}))
    };

    return <div className={styles['fileList']}>
        <FileListView
            nodes={files}
            onTryToOpenFile={onTryToOpenFile}
            onFolderClick={onFolderClick}
            contextMenuActions={contextMenuActions}
        />
        {contextMenuActions.contextMenuState.visible && contextMenuActions.contextMenuState.file && (
            <ContextMenu
                clickX={contextMenuActions.contextMenuState.clickX}
                clickY={contextMenuActions.contextMenuState.clickY}
                file={contextMenuActions.contextMenuState.file}
                onCloseContextMenu={contextMenuActions.onCloseContextMenu}
                {...{
                    copiedFile,
                    onCopyFile,
                    onPasteFile,
                    onOpenModalByReason,
                    onOpenDeleteModal
                }}
            />
        )}
    </div>;
};

export default FileList;