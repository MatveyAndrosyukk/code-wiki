import React, {FC, useEffect} from 'react';
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
import {clearFiles, resetFiles} from "../../store/slices/fileTreeSlice";
import {clearUser} from "../../store/slices/userSlice";

interface MainPageProps {
    emailParam?: string | undefined;
}

const MainPage: FC<MainPageProps> = ({emailParam}) => {
    const files = useSelector((state: RootState) => state.fileTree.files);
    const user = useSelector((state: RootState) => state.user.user);
    const openedFile = useSelector((state: RootState) => findOpenedFile(state.fileTree.files));
    const fileTreeActions = useFileTreeActions(files);
    const editFileViewActions = useEditFileActions();
    const loginState = useLoginActions();
    const fileSearch = useFileSearch();
    const dispatch = useDispatch<AppDispatch>();

    const effectiveEmail = emailParam || localStorage.getItem('email');

    useEffect(() => {
        if (effectiveEmail && effectiveEmail.trim() !== '') {
            dispatch(fetchUser(effectiveEmail));
        } else {
            dispatch(clearFiles());
            dispatch(clearUser());
        }
    }, [effectiveEmail, dispatch]);

    useEffect(() => {
        if (user) {
            const isUserEditor = user.whoCanEdit.some(u => u.email === localStorage.getItem('email'));
            const isUserEqualsLoggedIn = user.email === localStorage.getItem('email');
            if (user.isViewBlocked && !(isUserEditor || isUserEqualsLoggedIn)) {
                dispatch(clearFiles());
            } else {
                dispatch(fetchFiles(user.email)); // используйте user.email, чтобы гарантировать согласованность
            }
        }
    }, [user, dispatch]);

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
                    emailParam={emailParam}
                    user={user}
                    files={files}
                    {...editFileViewActions}
                    {...fileTreeActions}
                    {...loginState}
                />
                {openedFile ? <OpenedFile
                    user={user}
                    emailParam={emailParam}
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