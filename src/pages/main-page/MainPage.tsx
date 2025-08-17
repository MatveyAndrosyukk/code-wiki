import React, {useEffect} from 'react';
import Header from "./components/header/Header";
import styles from './MainPage.module.css'
import FileTree from "./components/file-tree/FileTree";
import OpenedFile from "./components/opened-file/OpenedFile";
import EmptyFile from "./components/empty-file/EmptyFile";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import findOpenedFile from "../../utils/findOpenedFile";
import useFileTreeActions from "../../utils/useFileTreeActions";
import EditModal from "../../ui-components/edit-modal/EditModal";
import DeleteModal from "../../ui-components/delete-modal/DeleteModal";
import useEditFileViewActions from "../../utils/useEditFileViewActions";
import useLoginState from "../../utils/useLoginState";
import useFileSearch from "../../utils/useFileSearch";
import {fetchFiles} from "../../store/thunks/fetchFiles";

const MainPage = () => {
    const files = useSelector((state: RootState) => state.fileTree.files);
    const openedFile = useSelector((state: RootState) => findOpenedFile(state.fileTree.files));
    const fileTreeActions = useFileTreeActions(files);
    const editFileViewActions = useEditFileViewActions();
    const loginState = useLoginState();
    const fileSearch = useFileSearch();

    const dispatch = useDispatch<AppDispatch>();
    const email = localStorage.getItem('email');

    useEffect(() => {
        if (loginState.isLoggedIn && email){
            dispatch(fetchFiles(email))
        }
    }, [loginState.isLoggedIn, email, dispatch]);

    return (
        <div className={styles['main']}>
            <Header
                {...{
                    files,
                    loginState,
                    fileSearch,
                }}
            />
            <div className={styles['container']}>
                <FileTree
                    files={files}
                    {...editFileViewActions}
                    {...fileTreeActions}
                    {...loginState}
                />
                {openedFile ? <OpenedFile
                    file={openedFile}
                    {...fileTreeActions}
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