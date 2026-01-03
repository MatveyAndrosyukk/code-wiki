import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo} from 'react'
import styles from './OpenedFile.module.scss'
import emptyStyles from './EmplyFile.module.scss'
import {ReactComponent as HeartBtn} from './images/opened-file-heart.svg'
import {ReactComponent as LikedHeartBtn} from './images/opened-file-red-heart.svg'
import {ReactComponent as BurgerSvg} from './images/empty-file-burger.svg'
import {ReactComponent as EditFileSvg} from './images/opened-file-edit.svg'
import {ReactComponent as DeleteFileSvg} from './images/opened-file-delete.svg'
import {ReactComponent as OpenButtonsSvg} from './images/opened-file-open.svg'
import {useDispatch} from 'react-redux'
import {AppDispatch} from '../../../../store'
import {parseFileTextToHTML} from '../../../../utils/functions/parseFile'
import findPathToFile from '../../../../utils/functions/findFilePath'
import EditMode from './components/edit-file-view/EditMode'
import {updateFileContent} from '../../../../store/thunks/files/updateFileContent'
import {checkIsUserLikedFileAsync} from '../../../../services/checkIsUserLikedFileAsync'
import {AppContext} from '../../../../context/AppContext'
import {isUserCanEdit} from '../../../../utils/functions/permissions-utils/isUserCanEdit'
import {useNavigate} from "react-router-dom";
import extractImagesName from "../../../../utils/functions/extractImageNames";
import {deleteExtraImagesAsync} from "../../../../services/deleteExtraImagesAsync";
import {File} from "../../../../types/file";

interface OpenedFileProps {
    file?: File | null
    emailParam: string | undefined
    isFileTreeOpened: boolean
    setIsFileTreeOpened: Dispatch<SetStateAction<boolean>>
}

const OpenedFile: React.FC<OpenedFileProps> = (
    {
        file = null,
        emailParam,
        isFileTreeOpened,
        setIsFileTreeOpened
    }) => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const context = useContext(AppContext)
    if (!context) throw new Error("Component can't be used without context")
    const {viewedUser, files, fileState, authState, loggedInUser} = context
    const [isLiked, setIsLiked] = React.useState(false)
    const [openedImage, setOpenedImage] = React.useState<string | null>(null)
    const [isMobile, setIsMobile] = React.useState(false)
    const [isBurgerMenuOpened, setIsBurgerMenuOpened] = React.useState(false)

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

    const handleImageClick = useCallback((imageUrl: string) => {
        setOpenedImage(imageUrl)
    }, []);

    useEffect(() => {
        if (!file) return;

        async function checkLike(): Promise<boolean> {
            const dto = {
                id: file?.id as number,
                email: localStorage.getItem('email') || '',
            }
            try {
                return await checkIsUserLikedFileAsync(dto)
            } catch (error) {
                console.error('Failed to check like status', error)
                return false
            }
        }

        checkLike().then(isLikedValue => {
            setIsLiked(isLikedValue)
        })
    }, [file])

    const parseFileTextToHTMLMemo = useCallback(
        (content: string,
         onImageClick: (url: string) => void,
         isFileTreeOpened: boolean) =>
            parseFileTextToHTML(content, onImageClick, isFileTreeOpened),
        []
    );

    const contentElements = useMemo(() => {
        if (!file?.content) return [];
        return parseFileTextToHTML(file.content, handleImageClick, isFileTreeOpened);
    }, [file?.content, handleImageClick, isFileTreeOpened]);

    const {
        isEditing,
        contentError,
        setIsEditing,
        setIsFileContentChanged,
        handleLikeFile,
        handleOpenDeleteModal,
    } = fileState

    const {
        isLoggedIn,
        handleOpenLoginModal
    } = authState

    const handleSaveEditedFileChanges = useCallback(async (
        newContent: string,
        addedImages: string[],
        onSuccess: () => void
    ) => {
        if (!file) return;
        if (contentError) return;

        try {
            await dispatch(updateFileContent({
                id: file.id as number,
                content: newContent,
                editor: loggedInUser?.email
            })).unwrap();

            const savedImages = extractImagesName(newContent);
            const extraImages = addedImages.filter(image => !savedImages.includes(image));

            if (extraImages.length > 0) {
                await deleteExtraImagesAsync(extraImages);
            }

            setIsEditing(false);
            setIsFileContentChanged(false);
            onSuccess();
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        }
    }, [contentError, dispatch, file, loggedInUser?.email, setIsEditing, setIsFileContentChanged]);

    const handleCancelEditedFileChanges = useCallback(async (
        addedImages: string[],
        onSuccess: () => void) => {
        if (addedImages.length > 0) {
            const savedImages: string[] = extractImagesName(file?.content || '');
            const extraImages = addedImages.filter(image => !savedImages.includes(image));
            await deleteExtraImagesAsync(extraImages);
        }

        setIsEditing(false)
        setIsFileContentChanged(false)
        onSuccess();
    }, [file?.content, setIsEditing, setIsFileContentChanged])

    const handleTryToLikeFile = useCallback(async () => {
        if (!file) return
        const email = localStorage.getItem("email")
        if (!email) {
            handleOpenLoginModal()
            return
        }
        const dto = {
            id: file.id as number,
            email: email,
        }
        setIsLiked(prev => !prev)
        try {
            await handleLikeFile(dto)
        } catch (error) {
            console.error("Failed to like file", error)
        }
    }, [file, handleOpenLoginModal, handleLikeFile])

    const likesClass = useMemo(() => {
        const likesCount = file?.likes?.toString().length || 1;
        return likesCount === 1 ? 'one-digit' :
            likesCount === 2 ? 'two-digit' :
                likesCount === 3 ? 'three-digit' : 'four-digit';
    }, [file?.likes]);

    const handleGoToUsersPage = useCallback((user: string | null) => {
        return navigate(`/${encodeURIComponent(user as string)}`)
    }, [navigate])

    const handleOpenEditionMode = useCallback(() => {
        setIsEditing(true);
        setIsBurgerMenuOpened(false);
    }, [setIsEditing])

    const handleDeleteFile = useCallback((file: File) => {
        handleOpenDeleteModal(file, viewedUser)
        setIsBurgerMenuOpened(false);
    }, [handleOpenDeleteModal, viewedUser])

    if (!file) {
        return (
            <div className={styles['opened-file']}>
                <div className={emptyStyles['empty-file__content']}>
                    <div className={emptyStyles['empty-file__book-wrapper']}>
                        <svg className={emptyStyles['book-wrapper__svg']} width="200" height="200" viewBox="0 0 22 22"
                             fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g className={emptyStyles['book-wrapper__right']}>
                                <path
                                    d="M11 3.99995C12.8839 2.91716 14.9355 2.15669 17.07 1.74995C17.551 1.63467 18.0523 1.63283 18.5341 1.74458C19.016 1.85632 19.4652 2.07852 19.8464 2.39375C20.2276 2.70897 20.5303 3.10856 20.7305 3.56086C20.9307 4.01316 21.0229 4.50585 21 4.99995V13.9999C20.9699 15.117 20.5666 16.1917 19.8542 17.0527C19.1419 17.9136 18.1617 18.5112 17.07 18.7499C14.9355 19.1567 12.8839 19.9172 11 20.9999"
                                    stroke="#E8E8E6" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                            </g>
                            <g className={emptyStyles['book-wrapper__left']}>
                                <path
                                    d="M10.9995 3.99995C9.1156 2.91716 7.06409 2.15669 4.92957 1.74995C4.44856 1.63467 3.94731 1.63283 3.46546 1.74458C2.98362 1.85632 2.53439 2.07852 2.15321 2.39375C1.77203 2.70897 1.46933 3.10856 1.26911 3.56086C1.0689 4.01316 0.976598 4.50585 0.999521 4.99995V13.9999C1.0296 15.117 1.433 16.1917 2.14533 17.0527C2.85767 17.9136 3.83793 18.5112 4.92957 18.7499C7.06409 19.1567 9.1156 19.9172 10.9995 20.9999"
                                    stroke="#E8E8E6" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"/>
                            </g>
                            <path d="M11 21V4" stroke="#E8E8E6" strokeWidth="0.7"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className={emptyStyles['empty-file__text']}>Open file</div>
                    </div>
                </div>
                <div
                    style={{display: isFileTreeOpened ? 'none' : 'flex'}}
                    className={emptyStyles['fileTree']}
                    onClick={(event) => {
                        event.stopPropagation()
                        setIsFileTreeOpened(!isFileTreeOpened)
                    }}>
                    <BurgerSvg className={emptyStyles['fileTree-image']}/>
                </div>
            </div>
        )
    }

    const pathToFile = findPathToFile(files, file.id)?.join('/')

    return (
        <div className={styles['opened-file']}>
            <div className={styles['opened-file__header']}>
                <div className={styles['header__left-side']}>
                    <div className={styles['header__likes']}>
                        <div
                            className={`${styles['header__likes-amount']} ${styles[likesClass]}`}>{file.likes}</div>
                        {
                            isLiked ?
                                <LikedHeartBtn onClick={() => handleTryToLikeFile()}/> :
                                <HeartBtn onClick={() => handleTryToLikeFile()}/>
                        }
                    </div>
                    <div className={styles['header__title']}>
                        <div className={styles['header__title-email']}>{viewedUser?.email}</div>
                        <span>|</span>
                        <div className={styles['header__title-path']} title={pathToFile}>{pathToFile}</div>
                    </div>
                </div>
                <div className={styles['header__right-side']}>
                    {isMobile ? (
                        <div className={styles['header__buttons']}>
                            <OpenButtonsSvg
                                className={`${styles['buttons-menu-open']}`}
                                onClick={() => setIsBurgerMenuOpened(!isBurgerMenuOpened)}/>
                            {isBurgerMenuOpened && !isEditing && (
                                <div className={styles['buttons-menu']}>
                                    <EditFileSvg
                                        className={`${styles['buttons-menu-item']}`}
                                        onClick={() => handleOpenEditionMode()}/>
                                    <DeleteFileSvg
                                        className={`${styles['buttons-menu-item']}`}
                                        onClick={() => handleDeleteFile(file)}/>
                                </div>
                            )}
                            {isBurgerMenuOpened && isEditing && (
                                <div className={styles['buttons-menu']}>
                                    <DeleteFileSvg
                                        className={`${styles['buttons-menu-item']}`}
                                        onClick={() => handleDeleteFile(file)}/>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles['header__links']}>
                            {isUserCanEdit(isLoggedIn, emailParam, viewedUser, loggedInUser) && (
                                <div
                                    className={styles['links__container']}>
                                    {!isEditing && (
                                        <div
                                            className={styles['links__edit']}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </div>
                                    )}
                                    <div
                                        onClick={() => handleOpenDeleteModal(file, viewedUser)}
                                        className={styles['links__delete']}
                                    >
                                        Delete
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {openedImage && (
                <div className={styles['opened-image__background']} onClick={() => setOpenedImage(null)}>
                    <img
                        src={openedImage}
                        alt="Opened"
                        className={styles['opened-image__image']}
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
            {isEditing ? (
                <EditMode
                    file={file}
                    onSaveEditedFileChanges={handleSaveEditedFileChanges}
                    onCancelEditedFileChange={handleCancelEditedFileChanges}
                    parseFileTextToHTML={parseFileTextToHTMLMemo}
                    onImageClick={handleImageClick}
                    isFileTreeOpened={isFileTreeOpened}
                />
            ) : (
                <div className={styles['opened-file__content']}>{contentElements}</div>
            )}
            <div className={styles['opened-file__footer']}>
                Last edited by:
                <span
                    onClick={() => handleGoToUsersPage(file.lastEditor)}
                    className={styles['footer__editor']}>
                            {file.lastEditor}
                        </span>
            </div>
            <div
                style={{display: isFileTreeOpened ? 'none' : 'flex'}}
                className={emptyStyles['file-tree']}
                onClick={(event) => {
                    event.stopPropagation()
                    setIsFileTreeOpened(!isFileTreeOpened)
                }}>
                <BurgerSvg className={emptyStyles['file-tree-image']}/>
            </div>
        </div>
    )
}

export default OpenedFile