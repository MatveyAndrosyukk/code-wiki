import React, {FC} from 'react';
import styles from './FileTree.module.css'
import fileTreeLock from './images/fileTree-lock.svg'
import FileList from "./components/file-list/FileList";
import {ActionType} from "../../../../utils/hooks/useFileTreeActions";
import {CreateFilePayload} from "../../../../store/thunks/createFileOnServer";
import {User} from "../../../../store/slices/userSlice";
import {AppDispatch} from "../../../../store";
import {useDispatch} from "react-redux";
import {changeUserIsViewBlocked} from "../../../../store/thunks/user/changeUserIsViewBlocked";

interface FileTreeProps {
    files: CreateFilePayload[];
    copiedFile: CreateFilePayload | null;
    onTryToOpenFile: (id: number | null) => void;
    onOpenModalByReason: (args: { reason: ActionType, id: number | null, title: string }) => void;
    onCopyFile: (file: CreateFilePayload) => void;
    onPasteFile: (id: number | null) => void;
    onOpenDeleteModal: (file: CreateFilePayload) => void;
    isLoggedIn: boolean;
    setIsLoginModalOpen: (isOpen: boolean) => void;
    user: User | null;
    emailParam: string | undefined;
}

const FileTree: FC<FileTreeProps> = (
    {
        files,
        copiedFile,
        onTryToOpenFile,
        onOpenModalByReason,
        onCopyFile,
        onPasteFile,
        onOpenDeleteModal,
        isLoggedIn,
        setIsLoginModalOpen,
        user,
        emailParam,
    }) => {
    const dispatch = useDispatch<AppDispatch>();

    const blockViewHandler = () => {
        dispatch(changeUserIsViewBlocked(user?.email as string)).then(() => console.log(user))
    }

    const handleCreateRootFolder = () => {
        isLoggedIn ? onOpenModalByReason({
            reason: ActionType.AddRootFolder,
            id: null,
            title: "Add root folder"
        }) : setIsLoginModalOpen(true);
    }

    const isUserCanEdit = () => {
        if (!isLoggedIn && !emailParam){
            return true
        }
        const isUserEditor = user?.whoCanEdit.some(user => user.email === localStorage.getItem('email'));
        const isUserEqualsLoggedIn = user?.email === localStorage.getItem('email');
        return isUserEditor || isUserEqualsLoggedIn;

    }

    const isUserCanView = () => {
        const isUserViewBlocked = user?.isViewBlocked ?? false;
        const isUserEditor = user?.whoCanEdit.some(u => u.email === localStorage.getItem('email'));
        const isUserEqualsLoggedIn = user?.email === localStorage.getItem('email');
        if (isUserViewBlocked) {

            return isUserEditor || isUserEqualsLoggedIn;
        }

        return true;
    };

    const isUserEqualsLoggedIn = () => {
        if (!emailParam && !isLoggedIn){
            return false;
        }
        return user?.email !== localStorage.getItem('email');

    }

    return (
        <div className={styles['fileTree']}>
            <div className={styles['fileTree__content']}>
                {isUserEqualsLoggedIn() && (
                    <div className={styles['fileTree__header']}>
                        <div className={styles['fileTree__user']}>
                            {user?.email}
                        </div>
                        <div className={styles['fileTree__line']}>

                        </div>
                    </div>
                )}
                {!isUserCanView() && (
                    <div className={styles['fileTree__view']}>
                        User blocked his files for view
                    </div>
                )}
                {isUserCanEdit() && (
                    <div
                        className={styles['fileTree__buttons']}
                    >
                        <div
                            className={styles['fileTree__buttons-create']}
                            onClick={() => handleCreateRootFolder()}
                        >
                            Create a root folder
                        </div>
                        {isLoggedIn && (
                            <div
                                className={styles['fileTree__buttons-block']}
                                title={user?.isViewBlocked
                                    ? 'Unblock view for other users'
                                    : 'Block view for other users'}
                                onClick={() => blockViewHandler()}
                                style={{background: user?.isViewBlocked ? '#191A1A' : '#202222'}}
                            >
                                <img src={fileTreeLock} alt="Lock"/>
                            </div>
                        )}
                    </div>
                )
                }
                {isUserCanView() && (
                    <div
                        className={styles['fileTree__files']}>
                        <FileList
                            user={user}
                            emailParam={emailParam}
                            isLoggedIn={isLoggedIn}
                            {...{
                                files,
                                copiedFile,
                                onTryToOpenFile,
                                onCopyFile,
                                onPasteFile,
                                onOpenModalByReason,
                                onOpenDeleteModal,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileTree;