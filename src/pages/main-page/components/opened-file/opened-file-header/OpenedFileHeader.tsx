import React, {Dispatch, SetStateAction, useEffect, useMemo} from 'react';
import styles from "../OpenedFile.module.scss";
import {isUserCanEdit} from "../../../../../utils/functions/permissions-utils/isUserCanEdit";
import {File} from "../../../../../types/file";
import {ReactComponent as HeartBtn} from '../images/opened-file-heart.svg'
import {ReactComponent as LikedHeartBtn} from '../images/opened-file-red-heart.svg'
import {ReactComponent as EditFileSvg} from '../images/opened-file-edit.svg'
import {ReactComponent as DeleteFileSvg} from '../images/opened-file-delete.svg'
import {ReactComponent as OpenButtonsSvg} from '../images/opened-file-open.svg'
import {User} from "../../../../../store/slices/userSlice";
import findPathToFile from "../../../../../utils/functions/findFilePath";

interface OpenedFileHeaderProps {
    file: File;
    isLiked: boolean;
    onTryToLikeFile: () => void;
    viewedUser: User | null;
    files: File[];
    isBurgerMenuOpened: boolean;
    setIsBurgerMenuOpened: Dispatch<SetStateAction<boolean>>;
    isEditing: boolean;
    onOpenEditionMode: () => void;
    onDeleteFile: (file: File) => void;
    isLoggedIn: boolean;
    emailParam: string | undefined;
    loggedInUser: User | null;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    onOpenDeleteModal: (file: File, user: User | null) => void;
}

const OpenedFileHeader:React.FC<OpenedFileHeaderProps> = (
    {
        file,
        isLiked,
        onTryToLikeFile,
        viewedUser,
        files,
        isBurgerMenuOpened,
        setIsBurgerMenuOpened,
        isEditing,
        onOpenEditionMode,
        onDeleteFile,
        isLoggedIn,
        emailParam,
        loggedInUser,
        setIsEditing,
        onOpenDeleteModal,
    }
) => {
    const [isMobile, setIsMobile] = React.useState(false)

    useEffect(() => {
        if (window.innerWidth <= 435) {
            setIsMobile(true)
        }

        const handleResize = () => {
            if (window.innerWidth <= 435) {
                setIsMobile(true)
            } else {
                setIsMobile(false)
            }
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, []);

    const likesClass = useMemo(() => {
        const likesCount = file?.likes?.toString().length || 1;
        return likesCount === 1 ? 'one-digit' :
            likesCount === 2 ? 'two-digit' :
                likesCount === 3 ? 'three-digit' : 'four-digit';
    }, [file?.likes]);

    const pathToFile = findPathToFile(files, file?.id as number)?.join('/')

    return (
        <div className={styles['opened-file__header']}>
            <div className={styles['header__left-side']}>
                <div className={styles['header__likes']}>
                    <div
                        className={`${styles['header__likes-amount']} ${styles[likesClass]}`}>{file?.likes}</div>
                    {
                        isLiked ?
                            <LikedHeartBtn onClick={() => onTryToLikeFile()}/> :
                            <HeartBtn onClick={() => onTryToLikeFile()}/>
                    }
                </div>
                <div className={styles['header__title']}>
                    <div className={styles['header__title-email']}>{viewedUser?.email}</div>
                    <span>|</span>
                    <div className={styles['header__title-path']} title={pathToFile}>{pathToFile}</div>
                </div>
            </div>
            <div className={styles['header__right-side']}>
                {/* ✅ ПРОВЕРКА ПРАВ ДО МЕНЮ! */}
                {isUserCanEdit(isLoggedIn, emailParam, viewedUser, loggedInUser) && (
                    <>
                        {isMobile ? (
                            <div className={styles['header__buttons']}>
                                <OpenButtonsSvg
                                    className={`${styles['buttons-menu-open']}`}
                                    onClick={() => setIsBurgerMenuOpened(!isBurgerMenuOpened)}/>
                                {isBurgerMenuOpened && !isEditing && (
                                    <div className={styles['buttons-menu']}>
                                        <EditFileSvg
                                            className={`${styles['buttons-menu-item']}`}
                                            onClick={() => onOpenEditionMode()}/>
                                        <DeleteFileSvg
                                            className={`${styles['buttons-menu-item']}`}
                                            onClick={() => onDeleteFile(file)}/>
                                    </div>
                                )}
                                {isBurgerMenuOpened && isEditing && (
                                    <div className={styles['buttons-menu']}>
                                        <DeleteFileSvg
                                            className={`${styles['buttons-menu-item']}`}
                                            onClick={() => onDeleteFile(file)}/>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles['header__links']}>
                                <div className={styles['links__container']}>
                                    {!isEditing && (
                                        <div
                                            className={styles['links__edit']}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </div>
                                    )}
                                    <div
                                        onClick={() => onOpenDeleteModal(file, viewedUser)}
                                        className={styles['links__delete']}
                                    >
                                        Delete
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OpenedFileHeader;