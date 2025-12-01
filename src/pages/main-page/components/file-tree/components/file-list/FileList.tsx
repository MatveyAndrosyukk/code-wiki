import React, {useCallback, useContext} from 'react';
import styles from './FileList.module.scss'
import {useDispatch} from "react-redux";
import {toggleFolder} from "../../../../../../store/slices/fileTreeSlice";
import ContextMenu from "../../../../../../ui-components/context-menu/ContextMenu";
import useContextMenuActions from "../../../../../../utils/hooks/useContextMenuActions";
import FileListView from "./components/file-list-view/FileListView";
import {AppContext} from "../../../../../../context/AppContext";

interface FileListProps {
    emailParam: string | undefined;
}

const FileList: React.FC<FileListProps> = (
    {
        emailParam,
    }
) => {
    const dispatch = useDispatch();
    const context = useContext(AppContext);
    if (!context) throw new Error("MainPage must be used within AppProvider");
    const {files} = context;
    const contextMenuAcState = useContextMenuActions()

    const {
        contextMenuState,
        handleCloseContextMenu
    } = contextMenuAcState;

    const onFolderClick = useCallback((id: number | null) => {
        dispatch(toggleFolder({id}));
    }, [dispatch]);

    return <div className={styles['file-list']}>
        <FileListView
            files={files}
            emailParam={emailParam}
            onFolderClick={onFolderClick}
            contextMenuState={contextMenuAcState}
        />
        {contextMenuState.visible && contextMenuState.file && (
            <ContextMenu
                clickX={contextMenuState.clickX}
                clickY={contextMenuState.clickY}
                file={contextMenuState.file}
                onCloseContextMenu={handleCloseContextMenu}
            />
        )}
    </div>;
};

export default FileList;