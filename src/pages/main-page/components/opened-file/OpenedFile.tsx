import React from 'react';
import styles from './OpenedFile.module.css';
import LikeBtn from './images/opened-file-like.svg';
import DownloadBtn from './images/opened-file-download.svg';
import {File} from "../../../../types/file";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {parseFile} from "./utils/parseFile";
import findFilePath from "./utils/findFilePath";
import EditFileView from "./components/edit-file-view/EditFileView";
import {updateFileContent} from "../../../../store/slices/fileTreeSlice"; // создайте такой action

interface OpenedFileProps {
    file: File;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    dirty: boolean;
    setDirty: (value: boolean) => void;
    onTryToSwitchFile: (targetFileId: number) => void;
    tryToSwitch: boolean;
    onConfirmSwitch: () => void;
    onRejectSwitch: () => void;
}

const OpenedFile: React.FC<OpenedFileProps> = (
    {
        file,
        isEditing,
        setIsEditing,
        dirty,
        setDirty,
        onTryToSwitchFile,
        tryToSwitch,
        onConfirmSwitch,
        onRejectSwitch,
    }
) => {
    const files = useSelector((state: RootState) => state.fileTree.files);
    const dispatch = useDispatch();
    const filePath = findFilePath(files, file.id)?.join('/');
    const contentElements = parseFile(file.content);

    // Сохраняет изменения в режиме "Edit"
    const handleSave = (newContent: string) => {
        dispatch(updateFileContent({id: file.id, content: newContent}));
        setIsEditing(false);
        setDirty(false);
    };

    // Отменяет изменения в режиме "Edit"
    const handleCancel = () => {
        setIsEditing(false);
        setDirty(false);
    };

    // В FileTree при клике на файл вызывайте handleTryToSwitchFile вместо обычного onFileClick, если редактирование активно

    return (
        <div className={styles['openedFile']}>
            <div className={styles['openedFile__header']}>
                <div className={styles['openedFile__leftSide']}>
                    <div className={styles['openedFile__leftSide-likes']}>
                        <div className={styles['openedFile__leftSide-likes-amount']}>
                            {file.likes}
                        </div>
                        <img src={LikeBtn} alt="Like"/>
                    </div>
                    <div className={styles['openedFile__leftSide-title']}>
                        <div className={styles['openedFile__leftSide-title-email']}>
                            {file.author}
                        </div>
                        <span>|</span>
                        <div
                            className={styles['openedFile__leftSide-title-path']}
                            title={filePath}>
                            {filePath}
                        </div>
                    </div>
                </div>
                <div className={styles['openedFile__rightSide']}>
                    <div className={styles['openedFile__rightSide-download']}>
                        <img src={DownloadBtn} alt="Download"/>
                    </div>
                    <div className={styles['openedFile__rightSide-like']}>
                        Like
                    </div>
                    <div
                        className={styles['openedFile__rightSide-edit']}
                        onClick={() => setIsEditing(true)}
                        style={{cursor: 'pointer'}}
                    >
                        Edit
                    </div>
                    <div className={styles['openedFile__rightSide-delete']}>
                        Delete
                    </div>
                </div>
            </div>
            {isEditing ?
                <EditFileView
                    file={file}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onTryToSwitchFile={onTryToSwitchFile}
                    isTryToSwitch={tryToSwitch}
                    isDirty={dirty}
                    setIsDirty={setDirty}
                    onConfirmSwitch={onConfirmSwitch}
                    onRejectSwitch={onRejectSwitch}
                    parseFile={parseFile}
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