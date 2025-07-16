import {useState, useRef, useCallback, useEffect} from "react";
import {useDispatch} from "react-redux";
import useClipboard from "./useClipboard";
import {File, FileType} from "../../../types/file";
import {addFile, addFolder, createRootFolder} from "../../../store/slices/fileTreeSlice";

export default function useFileTreeActions(files: File[]) {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalValue, setModalValue] = useState("");
    const [modalState, setModalState] = useState<{ reason: string, id: number | null }>({reason: "", id: null});
    const addFolderInputRef = useRef<HTMLInputElement>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean, file: File | null }>({open: false, file: null});

    useEffect(() => {
        if (isModalOpen && addFolderInputRef.current){
            addFolderInputRef.current.focus();
        }
    }, [isModalOpen])

    const checkIfNameExists = useCallback((
        files: File[],
        folderId: number,
        name: string
    ): boolean => {
        function findFolder(nodes: File[]): File | null {
            for (const node of nodes) {
                if (node.id === folderId && node.type === FileType.Folder) return node;
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

    const openModal = useCallback(({reason, id}: { reason: string, id: number | null }) => {
        setModalState({reason, id})
        setIsModalOpen(true);
    }, [])

    const clipboard = useClipboard(files, openModal, checkIfNameExists);

    const handleCreate = useCallback((
        title: string,
        id: number | null,
        actionType: 'addRoot' | 'addFolder' | 'addFile' | 'resolvePasteConflict'
    ) => {
        const trimmedTitle = title.trim();
        if (trimmedTitle === "") return;

        const handleNameConflict = (): boolean => {
            if (id === null) return true;
            if (checkIfNameExists(files, id, trimmedTitle)) {
                openModal({reason: 'resolvePasteConflict', id});
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
                    openModal({reason: 'resolvePasteConflict', id: null});
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
                if (!clipboard.copiedFile || id === null) {
                    if (isNameExistsInRoot()) return;
                    dispatch(createRootFolder({title: trimmedTitle}));
                    break;
                }
                if (handleNameConflict()) return;
                const newFile = {...clipboard.copiedFile, name: trimmedTitle};
                clipboard.doPaste(id, newFile);
                break;
            default:
                return;
        }
        setModalValue("");
        setIsModalOpen(false);
        setModalState({reason: "", id: null});
    }, [dispatch, clipboard, files, checkIfNameExists, openModal]);

    return {
        ...clipboard,
        isModalOpen,
        setIsModalOpen,
        modalValue,
        setModalValue,
        modalState,
        setModalState,
        addFolderInputRef,
        handleCreate,
        onOpenModal: openModal,
        onDeleteFile: (file: File) => setDeleteConfirm({open: true, file}),
        onRenameFile: (file: File) => {
            setModalState({reason: 'rename', id: file.id});
            setModalValue(file.name);
            setIsModalOpen(true);
        },
        isPasteConflict: modalState.reason === 'resolvePasteConflict',
        deleteConfirm,
    }
}