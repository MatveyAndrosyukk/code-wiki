import React, {FC, useCallback, useState} from 'react';
import Header from "./components/header/Header";
import styles from './Main.module.css'
import FileTree from "./components/file-tree/FileTree";
import OpenedFile from "./components/opened-file/OpenedFile";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {createRootFolder, openFile, pasteFile} from "../../store/slices/fileTreeSlice";
import findOpenedFile from "../../utils/findOpenedFile";
import EmptyFile from "./components/empty-file/EmptyFile";
import Modal from "../../ui-components/modal/Modal";
import {File} from "../../types/file";

const Main: FC = () => {
    const dispatch = useDispatch();
    const files = useSelector((state: RootState) => state.fileTree.files)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFolderTitle, setNewFolderTitle] = useState("");
        const [copiedFile, setCopiedFile] = useState<File | null>(null);

    // Из всех файлов ищет единственный открытый.
    const openedFile = useSelector((state: RootState) => {
        return findOpenedFile(state.fileTree.files);
    });

    // Вставляет скопированный файл.
    const handlePasteFile = useCallback((id: number) => {
        if (!copiedFile) return;
        dispatch(pasteFile({targetFolderId: id, file: copiedFile}))
    }, [copiedFile, dispatch]);

    // Обрабатывает копирование файла из контекстного меню.
    const handleCopyFile = useCallback((file: File) => {
        setCopiedFile(file);
        console.log(copiedFile)
    }, [copiedFile])

    // Callback из FileList, открывает файл и закрывает остальные.
    const handleFileClick = useCallback((id: number) => {
        dispatch(openFile({ id }));
    }, [dispatch]);

    const handleCreateRootFolder = useCallback(() => {
        setIsModalOpen(true);
    }, [])

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, [])

    const handleCreateNewFolder = () => {
        if (newFolderTitle.trim() === "") return;
        dispatch(createRootFolder({title: newFolderTitle.trim()}));
        setNewFolderTitle("")
        setIsModalOpen(false);
    }

    return (
        <div className={styles['main']}>
            <Header/>
            <div className={styles['container']}>
                <FileTree
                    files={files}
                    onFileClick={handleFileClick}
                    onCreateRootFolder={handleCreateRootFolder}
                    onCopyFile={handleCopyFile}
                    onPasteFile={handlePasteFile}
                />
                {openedFile ? <OpenedFile file={openedFile}/> : <EmptyFile/>}
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className={styles['createFolder__overlay']}>
                    <div className={styles['createFolder-form']}>
                        <input
                            type='text'
                            placeholder='Enter the title'
                            className={styles['createFolder-input']}
                            value={newFolderTitle}
                            onChange={(e) => setNewFolderTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleCreateNewFolder()
                                }
                            }}
                        />
                        {/*<button className={styles['createFolder-button']} onClick={handleCreateNewFolder}>*/}
                        {/*    Create*/}
                        {/*</button>*/}
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default Main;