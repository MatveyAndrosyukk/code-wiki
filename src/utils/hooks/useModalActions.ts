import {useCallback, useEffect, useRef, useState} from "react";
import {ActionType} from "./useFileTreeActions";
import {changeFileNameOnServer} from "../../store/thunks/changeFileNameOnServer";
import {
    checkIfNameExistsInFolder,
    createFilePayload, findNodeById,
    handleNameConflictInFolder,
    isNameExistsInRoot
} from "../modalUtils";
import {createFileOnServer, CreateFilePayload} from "../../store/thunks/createFileOnServer";
import useCopyPasteFile from "./useCopyPasteFile";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";

export default function useModalActions(files: CreateFilePayload[]) {
    const dispatch = useDispatch<AppDispatch>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalValue, setModalValue] = useState('');
    const [modalOpenState, setModalOpenState] = useState<{
        reason: ActionType | null;
        id: number | null;
        title: string | null;
    }>({reason: null, id: null, title: null});
    const modalInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isModalOpen && modalInputRef.current) {
            modalInputRef.current.focus();
        }
    }, [isModalOpen]);

    const openModalByReasonHandler = useCallback((
        {
            reason,
            id,
            title
        }: { reason: ActionType; id: number | null, title: string }) => {
        setModalOpenState({reason, id, title});

        const node = findNodeById(files, id);
        if (reason === ActionType.RenameFile) {
            setModalValue(node?.name || '');
        }
        setIsModalOpen(true);
    }, [files]);

    const clipboard = useCopyPasteFile(files, openModalByReasonHandler, checkIfNameExistsInFolder);

    const modalConfirmByReasonHandler = useCallback((
        title: string,
        id: number | null,
        actionType: ActionType
    ) => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;

        switch (actionType) {
            case ActionType.AddRootFolder:
                if (isNameExistsInRoot(files, trimmedTitle)) {
                    openModalByReasonHandler({reason: ActionType.ResolveNameConflictRoot, id: null, title: 'Add root folder'});
                    return;
                }
                dispatch(createFileOnServer(createFilePayload(
                    trimmedTitle,
                    localStorage.getItem('email'),
                    'Folder',
                    null
                )));
                break;

            case ActionType.RenameFile:
                if (handleNameConflictInFolder(
                    files,
                    id,
                    trimmedTitle,
                    ActionType.ResolveNameConflictRename,
                    openModalByReasonHandler
                )) return;
                dispatch(changeFileNameOnServer({id: id as number, name: trimmedTitle}));
                break;

            case ActionType.AddFolder:
                if (handleNameConflictInFolder(
                    files,
                    id,
                    trimmedTitle,
                    ActionType.ResolveNameConflictAddFolder,
                    openModalByReasonHandler
                )) return;
                dispatch(createFileOnServer(createFilePayload(
                    trimmedTitle,
                    localStorage.getItem('email'),
                    'Folder',
                    id
                )));
                break;

            case ActionType.AddFile:
                if (handleNameConflictInFolder(
                    files,
                    id,
                    trimmedTitle,
                    ActionType.ResolveNameConflictAddFile,
                    openModalByReasonHandler)) return;
                dispatch(createFileOnServer(createFilePayload(
                    trimmedTitle,
                    localStorage.getItem('email'),
                    'File',
                    id
                )));
                break;

            case ActionType.ResolveNameConflictRoot:
                if (isNameExistsInRoot(files, trimmedTitle)) return;
                dispatch(createFileOnServer(createFilePayload(
                    trimmedTitle,
                    localStorage.getItem('email'),
                    'Folder',
                    null
                )));
                break;

            case ActionType.ResolveNameConflictPaste:
                if (handleNameConflictInFolder(
                    files,
                    id,
                    trimmedTitle,
                    ActionType.ResolveNameConflictPaste,
                    openModalByReasonHandler
                )) return;

                if (clipboard.copiedFile) {
                    const copiedFileToSave: CreateFilePayload = {
                        ...clipboard.copiedFile,
                        id: null,
                        name: trimmedTitle,
                        parent: id
                    };
                    dispatch(createFileOnServer(copiedFileToSave));
                }
                break;

            case ActionType.ResolveNameConflictAddFile:
                if (handleNameConflictInFolder(
                    files,
                    id,
                    trimmedTitle,
                    ActionType.ResolveNameConflictAddFile,
                    openModalByReasonHandler
                )) return;
                dispatch(createFileOnServer(createFilePayload(
                    trimmedTitle,
                    localStorage.getItem('email'),
                    'File',
                    id
                )));
                break;

            case ActionType.ResolveNameConflictAddFolder:
                if (handleNameConflictInFolder(
                    files,
                    id,
                    trimmedTitle,
                    ActionType.ResolveNameConflictAddFolder,
                    openModalByReasonHandler
                )) return;
                dispatch(createFileOnServer(createFilePayload(
                    trimmedTitle,
                    localStorage.getItem('email'),
                    'Folder',
                    id
                )));
                break;

            case ActionType.ResolveNameConflictRename:
                if (handleNameConflictInFolder(
                    files,
                    id,
                    trimmedTitle,
                    ActionType.ResolveNameConflictRename,
                    openModalByReasonHandler
                )) return;
                if (clipboard.copiedFile) {
                    dispatch(changeFileNameOnServer({id: clipboard.copiedFile.id as number, name: trimmedTitle}));
                }
                break;

            default:
                return;
        }

        setModalValue('');
        setIsModalOpen(false);
        setModalOpenState({reason: null, id: null, title: null});
    }, [dispatch, files, openModalByReasonHandler, clipboard]);

    const openRenameModalHandler = useCallback((file: CreateFilePayload) => {
        openModalByReasonHandler({reason: ActionType.RenameFile, id: file.id, title: 'Rename file'});
        setModalValue(file.name);
    }, [openModalByReasonHandler]);

    const closeModalHandler = useCallback(() => {
        setModalValue('');
        setIsModalOpen(false);
        setModalOpenState({reason: null, id: null, title: null});
    }, []);

    const isNameConflictReason = useCallback(() => {
        const {reason} = modalOpenState;
        return reason === ActionType.ResolveNameConflictRoot ||
            reason === ActionType.ResolveNameConflictAddFolder ||
            reason === ActionType.ResolveNameConflictAddFile ||
            reason === ActionType.ResolveNameConflictRename ||
            reason === ActionType.ResolveNameConflictPaste;
    }, [modalOpenState]);

    return {
        clipboard,
        isModalOpen,
        setIsModalOpen,
        modalValue,
        setModalValue,
        modalOpenState,
        setModalOpenState,
        modalInputRef,
        onModalConfirmByReason: modalConfirmByReasonHandler,
        onOpenModalByReason: openModalByReasonHandler,
        onOpenRenameModal: openRenameModalHandler,
        onCloseModal: closeModalHandler,
        isNameConflictReason,
    };
}