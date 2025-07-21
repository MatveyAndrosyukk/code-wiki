import {useState, useRef, useCallback, useEffect} from "react";
import {useDispatch} from "react-redux";
import useClipboard from "./useClipboard";
import {File, FileType} from "../../../types/file";
import {addFile, addFolder, createRootFolder, deleteFile, pasteFile} from "../../../store/slices/fileTreeSlice";

export default function useFileTreeActions(files: File[]) {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalValue, setModalValue] = useState("");
    const [modalOpenState, setModalOpenState] = useState<{ reason: string, id: number | null }>({reason: "", id: null});
    const modalInputRef = useRef<HTMLInputElement>(null);
    const [deleteModalState, setDeleteModalState] = useState<{ open: boolean, file: File | null }>({open: false, file: null});

    useEffect(() => {
        if (isModalOpen && modalInputRef.current){
            modalInputRef.current.focus();
        }
    }, [isModalOpen])

    const checkIfNameExistsInFolder = useCallback((
        files: File[],
        folderId: number,
        name: string
    ): boolean => {
        function findFolderById(nodes: File[]): File | null {
            for (const node of nodes) {
                if (node.id === folderId && node.type === FileType.Folder) return node;
                if (node.type === FileType.Folder && node.children) {
                    const found = findFolderById(node.children);
                    if (found) return found;
                }
            }
            return null;
        }
        const targetFolder = findFolderById(files);
        if (targetFolder && targetFolder.children) {
            return targetFolder.children.some(child => child.name === name);
        }
        return false;
    }, []);

    const openModalByReasonHandler = useCallback(({reason, id}: { reason: string, id: number | null }) => {
        setModalOpenState({reason, id})
        setIsModalOpen(true);
    }, [])

    const clipboard = useClipboard(files, openModalByReasonHandler, checkIfNameExistsInFolder);

    const modalConfirmByReasonHandler = useCallback((
        title: string,
        id: number | null,
        actionType: 'addRoot' | 'addFolder' | 'addFile' | 'resolvePasteConflict'
    ) => {
        const trimmedTitle = title.trim();
        if (trimmedTitle === "") return;


        const handleNameConflictInFolder = (): boolean => {
            if (id === null) return true;
            if (checkIfNameExistsInFolder(files, id, trimmedTitle)) {
                openModalByReasonHandler({reason: 'resolvePasteConflict', id});
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
                    openModalByReasonHandler({reason: 'resolvePasteConflict', id: null});
                    return;
                }
                dispatch(createRootFolder({title: trimmedTitle}));
                break;
            case 'addFolder':
                if (handleNameConflictInFolder()) return;
                dispatch(addFolder({parentId: id!, title: trimmedTitle}));
                break;
            case 'addFile':
                if (handleNameConflictInFolder()) return;
                dispatch(addFile({parentId: id!, title: trimmedTitle}));
                break;
            case 'resolvePasteConflict':
                if (!clipboard.copiedFile || id === null) {
                    if (isNameExistsInRoot()) return;
                    dispatch(createRootFolder({title: trimmedTitle}));
                    break;
                }
                if (handleNameConflictInFolder()) return;
                const newFile = {...clipboard.copiedFile, name: trimmedTitle};
                dispatch(pasteFile({targetFolderId: id, file: newFile}));
                break;
            default:
                return;
        }
        setModalValue("");
        setIsModalOpen(false);
        setModalOpenState({reason: "", id: null});
    }, [dispatch, clipboard, files, checkIfNameExistsInFolder, openModalByReasonHandler]);

    const openRenameModalHandler = (file: File) => {
        openModalByReasonHandler({reason: 'rename', id: file.id});
        setModalValue(file.name);
    }

    const openDeleteModalHandler = (file: File) => {
        setDeleteModalState({open: true, file})
    }

    const closeModalHandler = () => {
        setModalValue("");
        setIsModalOpen(false);
        setModalOpenState({reason: "", id: null})
    }

    const deleteFileHandler = () => {
        if (!deleteModalState.file) return;
        dispatch(deleteFile({id: deleteModalState.file.id}));
        setDeleteModalState({open: false, file: null})
    }

    const cancelDeleteFileHandler = () => {
        setDeleteModalState({open: false, file: null})
    }

    return {
        ...clipboard,
        isModalOpen,
        setIsModalOpen,
        modalValue,
        setModalValue,
        modalOpenState,
        setModalOpenState,
        modalInputRef,
        onModalConfirmByReason: modalConfirmByReasonHandler,
        onOpenModalByReason: openModalByReasonHandler,
        onOpenDeleteModal: openDeleteModalHandler,
        onOpenRenameModal: openRenameModalHandler,
        onCloseModal: closeModalHandler,
        isPasteConflictReason: modalOpenState.reason === 'resolvePasteConflict',
        deleteModalState,
        onDeleteFile: deleteFileHandler,
        onCancelDeleteFile: cancelDeleteFileHandler
    }
}