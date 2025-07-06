import React from 'react';
import Header from "./components/header/Header";
import styles from './MainPage.module.css'
import FileTree from "./components/file-tree/FileTree";
import OpenedFile from "./components/opened-file/OpenedFile";
import EmptyFile from "./components/empty-file/EmptyFile";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import findOpenedFile from "./utils/findOpenedFile";
import useFileModal from "./utils/useFileModal";
import EditModal from "../../ui-components/edit-modal/EditModal";
import DeleteModal from "../../ui-components/delete-modal/DeleteModal";

const MainPage = () => {
    const files = useSelector((state: RootState) => state.fileTree.files);
    const openedFile = useSelector((state: RootState) => findOpenedFile(state.fileTree.files));
    const fileModal = useFileModal(files);

    return (
        <div className={styles['main']}>
            <Header/>
            <div className={styles['container']}>
                <FileTree
                    files={files}
                    copiedFile={fileModal.copiedFile}
                    onFileClick={fileModal.handleFileClick}
                    onOpenModal={fileModal.handleOpenModal}
                    onCopyFile={fileModal.handleCopyFile}
                    onPasteFile={fileModal.handlePasteFile}
                    onDeleteFile={fileModal.handleDeleteFile}
                    onRenameFile={fileModal.handleRenameFile}
                />
                {openedFile ? <OpenedFile file={openedFile}/> : <EmptyFile/>}
            </div>
            <EditModal {...fileModal} copiedFile={fileModal.copiedFile} />
            <DeleteModal {...fileModal} />
        </div>
    );
};

export default MainPage;