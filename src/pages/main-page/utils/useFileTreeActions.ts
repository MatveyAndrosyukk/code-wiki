import {useState, useRef, useCallback, useEffect} from "react";
import {useDispatch} from "react-redux";
import useClipboard from "./useClipboard";
import {File, FileType} from "../../../types/file";
import {
    addFile,
    addFolder,
    createRootFolder,
    deleteFile,
    pasteFile,
    renameFile
} from "../../../store/slices/fileTreeSlice";

export enum ActionType {
    RenameFile = "RenameFile",
    AddRootFolder = "AddRootFolder",
    AddFolder = "AddFolder",
    ResolveNameConflictRoot = "ResolveNameConflictRoot",
    ResolveNameConflictAddFile = "ResolveNameConflictAddFile",
    ResolveNameConflictAddFolder = "ResolveNameConflictAddFolder",
    ResolveNameConflictPaste = "ResolveNameConflictPaste",
    ResolveNameConflictRename = "ResolveNameConflictRename",
    AddFile = "AddFile"
}

export default function useFileTreeActions(files: File[]) {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalValue, setModalValue] = useState("");
    const [modalOpenState, setModalOpenState] = useState<{
        reason: ActionType | null,
        id: number | null
    }>({reason: null, id: null});
    const modalInputRef = useRef<HTMLInputElement>(null);
    const [deleteModalState, setDeleteModalState] = useState<{ open: boolean, file: File | null }>({
        open: false,
        file: null
    });

    useEffect(() => {
        if (isModalOpen && modalInputRef.current) {
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

    const openModalByReasonHandler = useCallback(({reason, id}: { reason: ActionType, id: number | null }) => {
        setModalOpenState({reason, id})
        setIsModalOpen(true);
    }, [])

    const clipboard = useClipboard(files, openModalByReasonHandler, checkIfNameExistsInFolder);

    const modalConfirmByReasonHandler = useCallback((
        title: string,
        id: number | null,
        actionType: ActionType
    ) => {
        const trimmedTitle = title.trim();
        if (trimmedTitle === "") return;


        const handleNameConflictInFolder = (reason: ActionType): boolean => {
            if (id === null) return true;
            if (checkIfNameExistsInFolder(files, id, trimmedTitle)) {
                if (reason === ActionType.AddFile || reason === ActionType.ResolveNameConflictAddFile) {
                    openModalByReasonHandler({reason: ActionType.ResolveNameConflictAddFile, id});
                }
                if (reason === ActionType.AddFolder || reason === ActionType.ResolveNameConflictAddFolder) {
                    openModalByReasonHandler({reason: ActionType.ResolveNameConflictAddFolder, id});
                }
                if (reason === ActionType.ResolveNameConflictPaste) {
                    openModalByReasonHandler({reason: ActionType.ResolveNameConflictPaste, id});
                }
                return true;
            }
            return false;
        };

        const isNameExistsInRoot = (): boolean => {
            return files.some(file => file.name === trimmedTitle);
        };

        switch (actionType) {
            case ActionType.AddRootFolder:
                if (isNameExistsInRoot()) {
                    openModalByReasonHandler({reason: ActionType.ResolveNameConflictRoot, id: null});
                    return;
                }
                dispatch(createRootFolder({title: trimmedTitle}));
                break;
            case ActionType.RenameFile:
                if (handleNameConflictInFolder(ActionType.ResolveNameConflictRename)) return;
                dispatch(renameFile({id: id!, newName: trimmedTitle}));
                break;
            case ActionType.AddFolder:
                if (handleNameConflictInFolder(ActionType.ResolveNameConflictAddFolder)) return;
                dispatch(addFolder({parentId: id!, title: trimmedTitle}));
                break;
            case ActionType.AddFile:
                if (handleNameConflictInFolder(ActionType.ResolveNameConflictAddFile)) return;
                dispatch(addFile({parentId: id!, title: trimmedTitle}));
                break;
            case ActionType.ResolveNameConflictRoot:
                if (isNameExistsInRoot()) return;
                dispatch(createRootFolder({title: trimmedTitle}));
                break;
            case ActionType.ResolveNameConflictPaste:
                if (handleNameConflictInFolder(ActionType.ResolveNameConflictPaste)) return;
                const newFile = {...clipboard.copiedFile, name: trimmedTitle} as File;
                dispatch(pasteFile({targetFolderId: id!, file: newFile}));
                break;
            case ActionType.ResolveNameConflictAddFile:
                if (handleNameConflictInFolder(ActionType.ResolveNameConflictAddFile)) return;
                dispatch(addFile({parentId: id!, title: trimmedTitle}));
                break;
            case ActionType.ResolveNameConflictAddFolder:
                if (handleNameConflictInFolder(ActionType.ResolveNameConflictAddFolder)) return;
                dispatch(addFolder({parentId: id!, title: trimmedTitle}));
                break;
            case ActionType.ResolveNameConflictRename:
                if (handleNameConflictInFolder(ActionType.ResolveNameConflictRename)) return;
                const renamedFile = {...clipboard.copiedFile, name: trimmedTitle} as File;
                dispatch(pasteFile({targetFolderId: id!, file: renamedFile}));
                break;
            default:
                return;
        }
        setModalValue("");
        setIsModalOpen(false);
        setModalOpenState({reason: null, id: null});
    }, [dispatch, clipboard, files, checkIfNameExistsInFolder, openModalByReasonHandler]);

    const openRenameModalHandler = (file: File) => {
        openModalByReasonHandler({reason: ActionType.RenameFile, id: file.id});
        setModalValue(file.name);
    }

    const openDeleteModalHandler = (file: File) => {
        setDeleteModalState({open: true, file})
    }

    const closeModalHandler = () => {
        setModalValue("");
        setIsModalOpen(false);
        setModalOpenState({reason: null, id: null})
    }

    const deleteFileHandler = () => {
        if (!deleteModalState.file) return;
        dispatch(deleteFile({id: deleteModalState.file.id}));
        setDeleteModalState({open: false, file: null})
    }

    const cancelDeleteFileHandler = () => {
        setDeleteModalState({open: false, file: null})
    }

    const isNameConflictReason = () => {
        return modalOpenState.reason === ActionType.ResolveNameConflictRoot ||
            modalOpenState.reason === ActionType.ResolveNameConflictAddFolder ||
            modalOpenState.reason === ActionType.ResolveNameConflictAddFile ||
            modalOpenState.reason === ActionType.ResolveNameConflictRename ||
            modalOpenState.reason === ActionType.ResolveNameConflictPaste;

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
        deleteModalState,
        isNameConflictReason,
        onDeleteFile: deleteFileHandler,
        onCancelDeleteFile: cancelDeleteFileHandler
    }
}