import React, {useEffect} from 'react';
import Header from "./components/header/Header";
import styles from './MainPage.module.css'
import FileTree from "./components/file-tree/FileTree";
import OpenedFile from "./components/opened-file/OpenedFile";
import EmptyFile from "./components/empty-file/EmptyFile";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import findOpenedFile from "../../utils/findOpenedFile";
import useFileTreeActions from "../../utils/hooks/useFileTreeActions";
import EditModal from "../../ui-components/edit-modal/EditModal";
import DeleteModal from "../../ui-components/delete-modal/DeleteModal";
import useEditFileActions from "../../utils/hooks/useEditFileActions";
import useLoginActions from "../../utils/hooks/useLoginActions";
import useFileSearch from "../../utils/hooks/useFileSearch";
import {fetchFiles} from "../../store/thunks/fetchFiles";
import {fetchUser} from "../../store/thunks/user/fetchUser";

const MainPage = () => {
    const files = useSelector((state: RootState) => state.fileTree.files);
    const user = useSelector((state: RootState) => state.user.user);
    const openedFile = useSelector((state: RootState) => findOpenedFile(state.fileTree.files));
    const fileTreeActions = useFileTreeActions(files);
    const editFileViewActions = useEditFileActions();
    const loginState = useLoginActions();
    const fileSearch = useFileSearch();

    const dispatch = useDispatch<AppDispatch>();
    const email = localStorage.getItem('email');

    useEffect(() => {
        if (loginState.isLoggedIn && email){
            dispatch(fetchFiles(email))
            dispatch(fetchUser(email))
        }
    }, [loginState.isLoggedIn, email, dispatch]);

    return (
        <div className={styles['main']}>
            <Header
                {...{
                    user,
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
                    {...loginState}
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