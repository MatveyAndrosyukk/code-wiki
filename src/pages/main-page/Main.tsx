import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import Header from "./components/header/Header";
import styles from './Main.module.css'
import FileTree from "./components/file-tree/FileTree";
import OpenedFile from "./components/opened-file/OpenedFile";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {addFile, addFolder, createRootFolder, deleteFile, openFile, pasteFile} from "../../store/slices/fileTreeSlice";
import findOpenedFile from "../../utils/findOpenedFile";
import EmptyFile from "./components/empty-file/EmptyFile";
import Modal from "../../ui-components/modal/Modal";
import {File, FileType} from "../../types/file";


const Main: FC = () => {
    const dispatch = useDispatch();

    const files = useSelector((state: RootState) => state.fileTree.files)

    // Скопированный файл или папка.
    const [copiedFile, setCopiedFile] = useState<File | null>(null);

    // Из всех файлов ищет единственный открытый.
    const openedFile = useSelector((state: RootState) => {
        return findOpenedFile(state.fileTree.files);
    });

    // Открыто ли модальное окно.
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Значение input модального окна.
    const [modalValue, setModalValue] = useState("");

    // Ref для того, чтобы делать focus для input.
    const addFolderInputRef = useRef<HTMLInputElement>(null)

    // State для того, чтобы использовать одно модальное окно для добавления/переименования файла/папки.
    const [modalState, setModalState] = useState<{ reason: string, id: number | null }>({reason: "", id: null});

    // Модальное окно с подтверждением удаления.
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean, file: File | null }>({open: false, file: null});

    const isPasteConflict = modalState.reason === 'resolvePasteConflict'

    // Если модальное окно открыто, input в фокусе. 
    useEffect(() => {
        if (isModalOpen && addFolderInputRef.current) {
            addFolderInputRef.current.focus()
        }
    }, [isModalOpen]);

    // При добавлении файла в папку проверяет, чтобы имя было уникальное.
    const checkIfNameExists = useCallback((
        files: File[],
        folderId: number,
        name: string
    ): boolean => {

        function findFolder(nodes: File[]): File | null {
            for (const node of nodes) {
                if (node.id === folderId && node.type === FileType.Folder) {
                    return node;
                }
                if (node.type === FileType.Folder && node.children) {
                    const found = findFolder(node.children);
                    if (found) return found;
                }
            }
            return null;
        }

        const targetFolder = findFolder(files);

        if (targetFolder && targetFolder.children) {
            return targetFolder.children.some(child => child.name === name);
        }
        return false;
    }, []);

    // Копирует файл.
    const handleCopyFile = useCallback((file: File) => {
        setCopiedFile(file);
    }, [])

    // Вставляет скопированный файл с проверкой на конфликт имен.
    const handlePasteFile = useCallback((id: number) => {
        if (!copiedFile) return;

        if (checkIfNameExists(files, id, copiedFile.name)) {
            setModalValue(copiedFile.name);
            setModalState({reason: 'resolvePasteConflict', id});
            setIsModalOpen(true);
        } else {
            dispatch(pasteFile({targetFolderId: id, file: copiedFile}));
        }
    }, [copiedFile, dispatch, files, checkIfNameExists]);

    // Открывает файл и закрывает все остальные.
    const handleFileClick = useCallback((id: number) => {
        dispatch(openFile({id}));
    }, [dispatch]);

    // Открывает модальное окно с определенной причиной (добавление файла/папки/root/переименование).
    const handleOpenModal = useCallback(({reason, id}: { reason: string, id: number | null }) => {
        setModalState({reason, id})
        setIsModalOpen(true);
    }, [])

    // Закрывает модальное окно.
    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setModalValue("")
    }, [])

    const handleDeleteFile = useCallback((file: File) => {
        setDeleteConfirm({open: true, file});
    }, [])

    const cancelDelete = useCallback(() => {
        setDeleteConfirm({open: false, file: null});
    }, []);

    const confirmDelete = useCallback(() => {
        if (deleteConfirm.file) {
            dispatch(deleteFile({id: deleteConfirm.file.id}));
        }
        setDeleteConfirm({open: false, file: null});
    }, [deleteConfirm, dispatch]);

    const handleRenameFile = useCallback((file: File) => {

    }, [])

    // Обработчик при нажатии на enter в модальном окне.
    const handleCreate = useCallback((
        title: string,
        id: number | null,
        actionType: 'addRoot' | 'addFolder' | 'addFile' | 'resolvePasteConflict'
    ) => {
        const trimmedTitle = title.trim();
        if (trimmedTitle === "") return;

        const handleNameConflict = (): boolean => {
            if (id === null) return true; // Невалидный id — блокируем действие
            if (checkIfNameExists(files, id, trimmedTitle)) {
                setModalState({reason: 'resolvePasteConflict', id});
                setIsModalOpen(true);
                return true;
            }
            return false;
        };

        const isNameExistsInRoot = (): boolean => {
            return files.some(file => file.name === trimmedTitle);
        };

        switch (actionType) {
            case 'addRoot':
                if (isNameExistsInRoot()) {
                    setModalState({reason: 'resolvePasteConflict', id: null});
                    setIsModalOpen(true);
                    return;
                }
                dispatch(createRootFolder({title: trimmedTitle}));
                break;
            case 'addFolder':
                if (handleNameConflict()) return;
                dispatch(addFolder({parentId: id!, title: trimmedTitle}));
                break;

            case 'addFile':
                if (handleNameConflict()) return;
                dispatch(addFile({parentId: id!, title: trimmedTitle}));
                break;

            case 'resolvePasteConflict':
                if (!copiedFile || id === null) {
                    if (isNameExistsInRoot()) return;
                    dispatch(createRootFolder({title: trimmedTitle}));
                    break;
                }
                if (handleNameConflict()) return;

                const newFile = {...copiedFile, name: trimmedTitle};
                dispatch(pasteFile({targetFolderId: id, file: newFile}));
                break;

            default:
                return;
        }

        // Общий сброс состояния модалки
        setModalValue("");
        setIsModalOpen(false);
        setModalState({reason: "", id: null});
    }, [dispatch, copiedFile, files, checkIfNameExists]);

    return (
        <div className={styles['main']}>
            <Header/>
            <div className={styles['container']}>
                <FileTree
                    files={files}
                    copiedFile={copiedFile}
                    onFileClick={handleFileClick}
                    onOpenModal={handleOpenModal}
                    onCopyFile={handleCopyFile}
                    onPasteFile={handlePasteFile}
                    onDeleteFile={handleDeleteFile}
                    onRenameFile={handleRenameFile}
                />
                {openedFile ? <OpenedFile file={openedFile}/> : <EmptyFile/>}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                isPasteConflict={isPasteConflict}
            >
                <div
                    className={styles['createFolder__overlay']}
                    style={isPasteConflict
                        ? {padding: '7px 17px 12px 17px'}
                        : undefined
                    }
                >
                    <div className={styles['createFolder__form']}>
                        {modalState.reason === 'resolvePasteConflict' && (
                            <p className={styles['createFolder__form-text']}>
                                {copiedFile?.type === FileType.Folder
                                    ? "Folder with this name exists. Enter another name:"
                                    : "File with this name exists. Enter another name:"}
                            </p>
                        )}
                        <input
                            ref={addFolderInputRef}
                            type='text'
                            className={styles['createFolder__form-input']}
                            placeholder={"Enter the title"}
                            value={modalValue}
                            onChange={(e) => setModalValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleCreate(
                                        modalValue,
                                        modalState.id,
                                        modalState.reason as 'addRoot' | 'addFolder' | 'addFile' | 'resolvePasteConflict'
                                    );
                                }
                            }}
                        />
                    </div>
                </div>
            </Modal>
            <Modal isOpen={deleteConfirm.open} onClose={cancelDelete}>
                <div
                    className={styles['createFolder__overlay']}
                    style={deleteConfirm.open ? {padding: '7px 11px 7px'} : undefined}
                >
                    <div className={styles['createFolder__form']}>
                        <p className={styles['createFolder__form-deleteText']}>
                            {deleteConfirm.file?.type === FileType.Folder ? (
                                <>
                                    Delete folder{" "}
                                    <span className={styles['createFolder__highlightName']}>
                "{deleteConfirm.file.name}"
            </span>{" "}
                                    and all its contents?
                                </>
                            ) : (
                                <>
                                    Delete file{" "}
                                    <span className={styles['createFolder__highlightName']}>
                "{deleteConfirm.file?.name}"
            </span>
                                    ?
                                </>
                            )}
                        </p>
                        <div className={styles['createFolder__form-buttons']}>
                            <button
                                className={styles['createFolder-button']}
                                style={{background: '#D32F2F'}}
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                            <button
                                className={styles['createFolder-button']}
                                style={{background: '#18A184'}}
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Main;