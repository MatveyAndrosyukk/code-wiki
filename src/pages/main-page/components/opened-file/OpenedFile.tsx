import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo} from 'react'
import styles from './OpenedFile.module.scss'
import emptyStyles from './components/empty-file/EmplyFile.module.scss'
import {ReactComponent as BurgerSvg} from './images/empty-file-burger.svg'
import {parseFileTextToHTML} from '../../../../utils/functions/parseFile'
import EditMode from './components/edit-file-view/EditMode'
import {checkIsUserLikedFileAsync} from '../../../../services/checkIsUserLikedFileAsync'
import {AppContext} from '../../../../context/AppContext'
import {useNavigate} from "react-router-dom";
import {File} from "../../../../types/file";
import EmptyFile from "./components/empty-file/EmptyFile";
import OpenedFileHeader from "./opened-file-header/OpenedFileHeader";

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
    const navigate = useNavigate()
    const context = useContext(AppContext)
    if (!context) throw new Error("Component can't be used without context")
    const {viewedUser, files, fileState, authState, loggedInUser} = context
    const [isLiked, setIsLiked] = React.useState(false)
    const [openedImage, setOpenedImage] = React.useState<string | null>(null)
    const [isBurgerMenuOpened, setIsBurgerMenuOpened] = React.useState(false)

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
        setIsEditing,
        handleLikeFile,
        handleOpenDeleteModal,
    } = fileState

    const {
        isLoggedIn,
        handleOpenLoginModal
    } = authState

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
            <EmptyFile
                isFileTreeOpened={isFileTreeOpened}
                setIsFileTreeOpened={setIsFileTreeOpened}/>
        )
    }

    return (
        <div className={styles['opened-file']}>
            <OpenedFileHeader {...{
                file,
                isLiked,
                viewedUser,
                loggedInUser,
                files,
                isBurgerMenuOpened,
                isEditing,
                isLoggedIn,
                emailParam,
                setIsEditing,
                setIsBurgerMenuOpened,
                onTryToLikeFile: handleTryToLikeFile,
                onOpenEditionMode: handleOpenEditionMode,
                onDeleteFile: handleDeleteFile,
                onOpenDeleteModal: handleOpenDeleteModal
            }}/>

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