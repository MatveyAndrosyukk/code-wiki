import React from 'react';
import styles from './FileList.module.css'
import {useDispatch} from "react-redux";
import {toggleFolder} from "../../../../../../store/slices/fileTreeSlice";
import ContextMenu from "../../../../../../ui-components/context-menu/ContextMenu";
import useContextMenuActions from "../../../../../../utils/hooks/useContextMenuActions";
import FileListView from "./components/file-list-view/FileListView";
import {ActionType} from "../../../../../../utils/hooks/useFileTreeActions";
import {CreateFilePayload} from "../../../../../../store/thunks/createFileOnServer";
import {User} from "../../../../../../store/slices/userSlice";

interface FileListProps {
    files: CreateFilePayload[];
    copiedFile: CreateFilePayload | null;
    onTryToOpenFile: (id: number | null) => void;
    onOpenModalByReason: (args: {reason: ActionType, id: number | null, title: string}) => void;
    onCopyFile: (file: CreateFilePayload) => void;
    onPasteFile: (id: number | null) => void;
    onOpenDeleteModal: (file: CreateFilePayload) => void;
    isLoggedIn: boolean;
    emailParam: string | undefined;
    user: User | null;
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
        isLoggedIn,
        emailParam,
        user,
    }
) => {
    const contextMenuActions = useContextMenuActions()
    const dispatch = useDispatch();

    const onFolderClick = (id: number | null) => {
        dispatch(toggleFolder({id}))
    };

    return <div className={styles['fileList']}>
        <FileListView
            user={user}
            emailParam={emailParam}
            isLoggedIn={isLoggedIn}
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