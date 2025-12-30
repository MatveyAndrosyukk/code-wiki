import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import Header from "./components/header/Header";
import styles from './MainPage.module.scss'
import FileTree from "./components/file-tree/FileTree";
import OpenedFile from "./components/opened-file/OpenedFile";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import findOpenedFile from "../../utils/functions/findOpenedFile";
import EditModal from "../../ui-components/edit-modal/EditModal";
import DeleteModal from "../../ui-components/delete-modal/DeleteModal";
import {fetchFilesByEmail} from "../../store/thunks/files/fetchFilesByEmail";
import {fetchViewedUserByEmail} from "../../store/thunks/user/fetchViewedUserByEmail";
import {clearFiles} from "../../store/slices/fileTreeSlice";
import {clearLoggedInUser, clearViewedUser, User} from "../../store/slices/userSlice";
import {AppContext} from "../../context/AppContext";
import LoginModal from "../../ui-components/login-modal/LoginModal";
import {fetchLoggedInUserByEmail} from "../../store/thunks/user/fetchLoggedInUserByEmail";
import EnterEmailModal from "../../ui-components/enter-email-modal/EnterEmailModal";
import ResetPasswordModal from "../../ui-components/reset-password-modal/ResetPasswordModal";
import {isUserOwner} from "../../utils/functions/permissions-utils/isUserOwner";
import BanModal from "../../ui-components/ban-modal/BanModal";
import findPathToFile from "../../utils/functions/findFilePath";

interface MainPageProps {
    emailParam?: string | undefined;
    resetToken?: string | undefined;
}

const MainPage: FC<MainPageProps> = ({emailParam, resetToken}) => {
    const dispatch = useDispatch<AppDispatch>();
    const context = useContext(AppContext);
    if (!context) throw new Error("Component can't be used without context");
    const {viewedUser, loggedInUser, authState, files} = context;
    const openedFile = useSelector((state: RootState) => findOpenedFile(state.fileTree.files));
    const authorizedUserEmail = localStorage.getItem('email');
    const currentUserEmail = emailParam || authorizedUserEmail;
    const prevViewedUserRef = useRef<User | null>(null);

    const [isFileTreeOpened, setIsFileTreeOpened] = useState<boolean>(false);

    const {
        setIsResetPasswordModalOpened,
    } = authState

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1270) {
                setIsFileTreeOpened(false);
            } else {
                setIsFileTreeOpened(true);
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (resetToken) {
            setIsResetPasswordModalOpened(true);
        }
    }, [resetToken, setIsResetPasswordModalOpened]);

    useEffect(() => {
        if (currentUserEmail && currentUserEmail.trim() !== '') {
            dispatch(fetchViewedUserByEmail(currentUserEmail));
            dispatch(fetchLoggedInUserByEmail(authorizedUserEmail))
        } else {
            dispatch(clearFiles());
            dispatch(clearViewedUser());
            dispatch(clearLoggedInUser());
        }
    }, [currentUserEmail, dispatch, authorizedUserEmail]);

    useEffect(() => {
        if (viewedUser) {
            const prevViewedUser = prevViewedUserRef.current;

            const isOnlyCounterOrViewBlockedChanged = prevViewedUser &&
                prevViewedUser.email === viewedUser.email &&
                JSON.stringify({
                    ...prevViewedUser,
                    isViewBlocked: undefined,
                    amountOfFiles: undefined
                }) === JSON.stringify({
                    ...viewedUser,
                    isViewBlocked: undefined,
                    amountOfFiles: undefined
                }) &&
                (
                    prevViewedUser.isViewBlocked !== viewedUser.isViewBlocked ||
                    prevViewedUser.amountOfFiles !== viewedUser.amountOfFiles
                );

            if (!isOnlyCounterOrViewBlockedChanged) {
                const isUserEditor = viewedUser.whoCanEdit.some(u => u.email === loggedInUser?.email);
                const isUserEqualsLoggedIn = viewedUser.email === loggedInUser?.email;

                if (viewedUser.isViewBlocked && !(isUserEditor || isUserEqualsLoggedIn)) {
                    dispatch(clearFiles());
                } else {
                    dispatch(fetchFilesByEmail(viewedUser.email));
                }
            }

            prevViewedUserRef.current = viewedUser;
        }
    }, [viewedUser, dispatch, loggedInUser?.email]);

    useEffect(() => {
        if (openedFile) {
            document.title = findPathToFile(files, openedFile.id)?.join('/') as string
        }else {
            document.title = "DocuWiki"
        }
    }, [files, openedFile]);

    return (
        <div className={styles['main']}>
            <Header/>
            <div className={styles['container']}>
                <FileTree
                    isOpened={isFileTreeOpened}
                    setIsOpened={setIsFileTreeOpened}
                    emailParam={emailParam}
                />
                <OpenedFile
                    isFileTreeOpened={isFileTreeOpened}
                    setIsFileTreeOpened={setIsFileTreeOpened}
                    emailParam={emailParam}
                    file={openedFile}/>
            </div>
            {(isFileTreeOpened && window.innerWidth < 1270) && (
                <div
                    className={styles['overlay']}
                    onClick={() => setIsFileTreeOpened(false)}
                />
            )}
            <EditModal/>
            <DeleteModal/>
            <LoginModal/>
            <EnterEmailModal/>
            <ResetPasswordModal resetToken={resetToken}/>
            {isUserOwner(loggedInUser) && <BanModal/>}
        </div>
    );
};

export default MainPage;