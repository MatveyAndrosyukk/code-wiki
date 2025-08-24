import React, {useEffect} from 'react';
import styles from './OpenedFile.module.css';
import LikeBtn from './images/opened-file-like.svg';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../store";
import {parseFileTextToHTML} from "../../../../utils/parseFile";
import findPathToFile from "../../../../utils/findFilePath"; // создайте такой action
import EditFileView from "./components/edit-file-view/EditFileView";
import {CreateFilePayload} from "../../../../store/thunks/createFileOnServer";
import {changeFileContentOnServer} from "../../../../store/thunks/changeFileContentOnServer";
import {ChangeFileLikesPayload} from "../../../../store/thunks/changeFileLikesOnServer";
import {isFileLikedByUser} from "../../../../api/isFileLikedByUser";

interface OpenedFileProps {
    file: CreateFilePayload;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    setIsFileContentChanged: (value: boolean) => void;
    isTryToSwitchWhileEditing: boolean;
    onConfirmSwitch: () => void;
    onRejectSwitch: () => void;
    onOpenDeleteModal: (file: CreateFilePayload) => void;
    onLikeFile: (dto: ChangeFileLikesPayload) => Promise<any>
    openLoginModal: () => void;
}

const OpenedFile: React.FC<OpenedFileProps> = (
    {
        file,
        isEditing,
        setIsEditing,
        setIsFileContentChanged,
        isTryToSwitchWhileEditing,
        onConfirmSwitch,
        onRejectSwitch,
        onOpenDeleteModal,
        onLikeFile,
        openLoginModal,
    }
) => {
    const files = useSelector((state: RootState) => state.fileTree.files);
    const dispatch = useDispatch<AppDispatch>();
    const pathToFile = findPathToFile(files, file.id)?.join('/');
    const contentElements = parseFileTextToHTML(file.content);
    const [isLiked, setIsLiked] = React.useState(false);

    useEffect(() => {
        async function checkLike(): Promise<boolean> {
            const dto = {
                id: file.id as number,
                email: localStorage.getItem('email') || '',
            };
            try {
                return await isFileLikedByUser(dto);
            } catch (error) {
                console.error('Failed to check like status', error);
                return false;
            }
        }

        checkLike().then(isLikedValue => {
            setIsLiked(isLikedValue);
        });
    }, [file.id]);

    const handleSaveEditedFileChanges = (newContent: string) => {
        dispatch(changeFileContentOnServer({id: file.id as number, content: newContent}))
        setIsEditing(false);
        setIsFileContentChanged(false);
    };

    const handleCancelEditedFileChanges = () => {
        setIsEditing(false);
        setIsFileContentChanged(false);
    };

    const handleLikeFile = async () => {
        const email = localStorage.getItem("email");
        if (!email) {
            openLoginModal();
            return;
        }
        const dto = {
            id: file.id as number,
            email: email,
        }
        try {
            await onLikeFile(dto);
            setIsLiked(prev => !prev);
        } catch (error) {
            console.error("Failed to like file", error);
        }
    }

    return (
        <div className={styles['openedFile']}>
            <div className={styles['openedFile__header']}>
                <div className={styles['openedFile__leftSide']}>
                    <div className={styles['openedFile__likes']}>
                        <div className={styles['openedFile__likes-amount']}>
                            {file.likes}
                        </div>
                        <img src={LikeBtn} alt="Like"/>
                    </div>
                    <div className={styles['openedFile__title']}>
                        <div className={styles['openedFile__title-email']}>
                            {localStorage.getItem('email')}
                        </div>
                        <span>|</span>
                        <div
                            className={styles['openedFile__title-path']}
                            title={pathToFile}>
                            {pathToFile}
                        </div>
                    </div>
                </div>
                <div className={styles['openedFile__rightSide']}>
                    {/*<div className={styles['openedFile__download']}>*/}
                    {/*    <img src={DownloadBtn} alt="Download"/>*/}
                    {/*</div>*/}
                    <div
                        onClick={() => handleLikeFile()}
                        className={styles['openedFile__like']}
                        style={{color: isLiked ? '#81A2BE' : '#8D9191'}}
                    >
                        Like
                    </div>
                    <div
                        className={styles['openedFile__edit']}
                        onClick={() => setIsEditing(true)}
                        style={{cursor: 'pointer'}}
                    >
                        Edit
                    </div>
                    <div
                        onClick={() => onOpenDeleteModal(file)}
                        className={styles['openedFile__delete']}>
                        Delete
                    </div>
                </div>
            </div>
            {isEditing ?
                <EditFileView

                    file={file}
                    onSaveEditedFileChanges={handleSaveEditedFileChanges}
                    onCancelEditedFileChange={handleCancelEditedFileChanges}
                    isTryToSwitchWhileEditing={isTryToSwitchWhileEditing}
                    setIsFileContentChanged={setIsFileContentChanged}
                    onConfirmSwitch={onConfirmSwitch}
                    onRejectSwitch={onRejectSwitch}
                    parseFileTextToHTML={parseFileTextToHTML}
                />
                :
                <div className={styles['openedFile__content']}>
                    {contentElements}
                </div>
            }
        </div>
    );
};

export default OpenedFile;