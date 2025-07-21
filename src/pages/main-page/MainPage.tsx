import React from 'react';
import Header from "./components/header/Header";
import styles from './MainPage.module.css'
import FileTree from "./components/file-tree/FileTree";
import OpenedFile from "./components/opened-file/OpenedFile";
import EmptyFile from "./components/empty-file/EmptyFile";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import findOpenedFile from "./utils/findOpenedFile";
import useFileTreeActions from "./utils/useFileTreeActions";
import EditModal from "../../ui-components/edit-modal/EditModal";
import DeleteModal from "../../ui-components/delete-modal/DeleteModal";
import useEditFileViewActions from "./utils/useEditFileViewActions";

const MainPage = () => {
    const files = useSelector((state: RootState) => state.fileTree.files);
    const openedFile = useSelector((state: RootState) => findOpenedFile(state.fileTree.files));
    const fileTreeActions = useFileTreeActions(files);
    const editFileViewActions = useEditFileViewActions()

    return (
        <div className={styles['main']}>
            <Header/>
            <div className={styles['container']}>
                <FileTree
                    files={files}
                    {...editFileViewActions}
                    {...fileTreeActions}
                />
                {openedFile ? <OpenedFile
                    file={openedFile}
                    {...editFileViewActions}
                /> : <EmptyFile/>}
            </div>
            <EditModal {...fileTreeActions}/>
            <DeleteModal
                {...fileTreeActions}
            />
        </div>
    );
};

export default MainPage;