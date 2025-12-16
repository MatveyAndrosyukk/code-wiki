import React, {Dispatch, FC, SetStateAction, useCallback, useContext, useEffect, useRef, useState} from 'react';
import styles from './FileTree.module.scss'
import commonStyles from '../../../../styles/Common.module.scss'
import {ReactComponent as LockSvg} from './images/fileTree-lock.svg'
import {ReactComponent as BanSvg} from './images/fileTree-ban.svg'
import FileList from "./components/file-list/FileList";
import {AppDispatch} from "../../../../store";
import {useDispatch} from "react-redux";
import {toggleUserIsViewBlocked} from "../../../../store/thunks/user/toggleUserIsViewBlocked";
import {AppContext} from "../../../../context/AppContext";
import {ActionType} from "../../../../utils/supporting-hooks/useModalActions";
import {isUserCanEdit} from "../../../../utils/functions/permissions-utils/isUserCanEdit";
import {isUserCanView} from "../../../../utils/functions/permissions-utils/isUserCanView";
import {isUserEqualsLoggedIn} from "../../../../utils/functions/permissions-utils/isUserEqualsLoggedIn";
import {isUserOwner} from "../../../../utils/functions/permissions-utils/isUserOwner";

interface FileTreeProps {
    emailParam: string | undefined;
    isOpened: boolean;
    setIsOpened: Dispatch<SetStateAction<boolean>>;
}

const FileTree: FC<FileTreeProps> = (
    {
        emailParam,
        isOpened,
        setIsOpened,
    }) => {
    const dispatch = useDispatch<AppDispatch>();
    const context = useContext(AppContext);
    if (!context) throw new Error("Component can't be used without context");
    const {viewedUser, loggedInUser, authState, fileState, banState} = context;
    const [fileTreeStyles, setFileTreeStyles] = useState(``);
    const [showBlockMessage, setShowBlockMessage] = useState(false);
    const fileTreeRef = useRef<HTMLDivElement>(null);

    const {setIsBanModalOpened} = banState;

    const {
        isLoggedIn,
        setIsLoginModalOpen,
    } = authState;

    const {handleOpenModalByReason} = fileState;

    const blockViewHandler = useCallback(async () => {
        if (viewedUser?.email) {
            try {
                await dispatch(toggleUserIsViewBlocked(viewedUser.email));
                setShowBlockMessage(true);

                setTimeout(() => {
                    setShowBlockMessage(false);
                }, 3000);
            } catch (error) {
                console.error('Failed to toggle view block:', error);
            }
        }
    }, [dispatch, viewedUser]);

    useEffect(() => {
        if (window.innerWidth < 1270) {
            const handleClickOutsideFileTree = (event: MouseEvent) => {
                if (fileTreeRef.current && !fileTreeRef.current.contains(event.target as Node)) {
                    setIsOpened(false);
                }
            };

            if (isOpened) {
                document.addEventListener('dblclick', handleClickOutsideFileTree);
            }

            return () => {
                document.removeEventListener('dblclick', handleClickOutsideFileTree);
            };
        }
    }, [isOpened, setIsOpened]);

    useEffect(() => {
        const handleChooseFileTreeStyles = () => {
            if (isOpened && window.innerWidth > 1270) {
                setFileTreeStyles(styles['file-tree']);
            } else if (isOpened && window.innerWidth < 1270) {
                setFileTreeStyles(`${styles['file-tree']}  ${styles['file-tree--fixed']}`);
            } else {
                setFileTreeStyles(styles['file-tree-closed']);
            }
        };

        handleChooseFileTreeStyles();
    }, [isOpened]);

    const handleCreateRootFolder = useCallback(() => {
        if (isLoggedIn) {
            handleOpenModalByReason({
                reason: ActionType.AddRootFolder,
                id: null,
                title: "Add root folder",
            });
        } else {
            setIsLoginModalOpen(true);
        }
    }, [isLoggedIn, handleOpenModalByReason, setIsLoginModalOpen]);

    const isBanned = !!viewedUser?.banned;

    return (
        <div
            ref={fileTreeRef}
            className={fileTreeStyles}
        >
            <div className={styles['file-tree__content']}>
                {isUserEqualsLoggedIn(emailParam, isLoggedIn, viewedUser) && (
                    <div className={styles['file-tree__header']}>
                        <div className={styles['file-tree__top']}>
                            <div className={styles['file-tree__user']}>
                                {viewedUser?.email}
                            </div>
                            {isUserOwner(loggedInUser) && (
                                <div
                                    className={styles['file-tree__ban']}
                                    onClick={() => setIsBanModalOpened(true)}
                                >
                                    <BanSvg/>
                                </div>
                            )}
                        </div>
                        <div className={styles['file-tree__line']}></div>
                    </div>
                )}

                {isBanned ? (
                    <div className={styles['file-tree__view']}>
                        This user has been banned
                    </div>
                ) : (
                    !isUserCanView(viewedUser, loggedInUser) && (
                        <div className={styles['file-tree__view']}>
                            User blocked his files for view
                        </div>
                    )
                )}

                {showBlockMessage && (
                    <div className={commonStyles['common__notification']}>
                        You {viewedUser?.isViewBlocked ? 'blocked' : 'unblocked'} files for view of other people
                    </div>
                )}

                {!isBanned && isUserCanEdit(isLoggedIn, emailParam, viewedUser, loggedInUser) && (
                    <div className={styles['file-tree__buttons']}>
                        <div
                            className={styles['file-tree__button-create']}
                            onClick={handleCreateRootFolder}
                        >
                            Create a root folder
                        </div>
                        {isLoggedIn && (
                            <div
                                className={styles['file-tree__button-block']}
                                title={viewedUser?.isViewBlocked
                                    ? 'Unblock view for other users'
                                    : 'Block view for other users'}
                                onClick={blockViewHandler}
                                style={{background: viewedUser?.isViewBlocked ? '#191A1A' : '#202222'}}
                            >
                                <LockSvg/>
                            </div>
                        )}
                    </div>
                )}
                {!isBanned && isUserCanView(viewedUser, loggedInUser) && (
                    <div className={styles['file-tree__files']}>
                        <FileList emailParam={emailParam}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileTree;