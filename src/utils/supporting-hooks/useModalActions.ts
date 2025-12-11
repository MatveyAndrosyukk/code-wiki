import {Dispatch, Ref, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {updateFileName} from "../../store/thunks/files/updateFileName";
import {
    checkIfNameExistsInFolder,
    createFilePayload,
    findNodeById,
    handleNameConflictInFolder,
    isNameExistsInRoot
} from "../functions/modalUtils";
import {createFile, CreateFilePayload} from "../../store/thunks/files/createFile";
import useCopyPasteActions, {CopyPasteState} from "./useCopyPasteActions";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {User} from "../../store/slices/userSlice";
import {fetchViewedUserByEmail} from "../../store/thunks/user/fetchViewedUserByEmail";

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

export interface ModalOpenState {
    reason: ActionType | null;
    id: number | null;
    title: string | null;
}

export type ModalActionsState = CopyPasteState & {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    modalValue: string,
    modalError: string,
    setModalError: Dispatch<SetStateAction<string>>
    setModalValue: Dispatch<SetStateAction<string>>;
    modalOpenState: ModalOpenState;
    setModalOpenState: Dispatch<SetStateAction<ModalOpenState>>;
    modalInputRef: Ref<HTMLInputElement | null> | null;
    isNameConflictReason: () => boolean;
    handleOpenRenameModal: (file: CreateFilePayload) => void;
    handleCloseModal: () => void;
    handleConfirmModalByReason: (modalState: ModalOpenState & { title: string }) => void;
    handleOpenModalByReason: (modalState: ModalOpenState) => void;
}

export default function useModalActions(
    files: CreateFilePayload[],
    viewedUser: User | null,
): ModalActionsState {
    const dispatch = useDispatch<AppDispatch>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalValue, setModalValue] = useState<string>('');
    const [modalError, setModalError] = useState<string>('');
    const [modalOpenState, setModalOpenState] = useState<ModalOpenState>({reason: null, id: null, title: null});
    const modalInputRef = useRef<HTMLInputElement>(null);
    const [pendingPasteId, setPendingPasteId] = useState<number | null>(null);

    const handleOpenModalByReason = useCallback((modalState: ModalOpenState) => {
        setModalOpenState(modalState);

        const node = findNodeById(files, modalState.id);
        if (modalState.reason === ActionType.RenameFile) {
            setModalValue(node?.name || '');
        } else {
            setModalValue('')
        }
        setIsModalOpen(true);
    }, [files]);

    const copyPasteActions = useCopyPasteActions(files, handleOpenModalByReason, checkIfNameExistsInFolder);

    useEffect(() => {
        if (isModalOpen && modalInputRef.current) {
            modalInputRef.current.focus();
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (pendingPasteId !== null && copyPasteActions.copiedFile) {
            copyPasteActions.handlePasteFile(pendingPasteId);
            setPendingPasteId(null);
        }
    }, [pendingPasteId, copyPasteActions]);

    const handleConfirmModalByReason = useCallback(async (
        modalState: ModalOpenState & { title: string }
    ) => {
        const {reason, id, title} = modalState;
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;

        switch (reason) {
            case ActionType.AddRootFolder:
                if (isNameExistsInRoot(files, trimmedTitle)) {
                    handleOpenModalByReason({
                        reason: ActionType.ResolveNameConflictRoot,
                        id: null,
                        title: 'Add root folder'
                    });
                    return;
                }
                dispatch(createFile(createFilePayload(
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
                    handleOpenModalByReason
                )) return;
                dispatch(updateFileName({id: id as number, name: trimmedTitle}));
                break;

            case ActionType.AddFolder:
                if (handleNameConflictInFolder(
                    files,
                    id,
                    trimmedTitle,
                    ActionType.ResolveNameConflictAddFolder,
                    handleOpenModalByReason
                )) return;
                dispatch(createFile(createFilePayload(
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
                    handleOpenModalByReason)) return;
                if (viewedUser && viewedUser.amountOfFiles >= 20) {
                    setModalError(`You can't create more than 20 files`);
                    return;
                }
                const result = dispatch(createFile(createFilePayload(
                    trimmedTitle,
                    localStorage.getItem('email'),
                    'File',
                    id
                )));
                await result;

                if (viewedUser) {
                    dispatch(fetchViewedUserByEmail(viewedUser.email));
                }
                break;

            case ActionType.ResolveNameConflictRoot:
                if (isNameExistsInRoot(files, trimmedTitle)) return;
                dispatch(createFile(createFilePayload(
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
                    handleOpenModalByReason
                )) return;

                if (copyPasteActions.copiedFile) {
                    copyPasteActions.setCopiedFile({
                        ...copyPasteActions.copiedFile,
                        name: trimmedTitle
                    });
                    setPendingPasteId(id)
                }

                break;

            case ActionType.ResolveNameConflictAddFile:
                if (handleNameConflictInFolder(
                    files,
                    id,
                    trimmedTitle,
                    ActionType.ResolveNameConflictAddFile,
                    handleOpenModalByReason
                )) return;
                if (viewedUser && viewedUser.amountOfFiles >= 20) {
                    setModalError(`You can't create more than 20 files`);
                    return;
                }
                const addFileAfterNameConflict = dispatch(createFile(createFilePayload(
                    trimmedTitle,
                    localStorage.getItem('email'),
                    'File',
                    id
                )));
                await addFileAfterNameConflict;

                if (viewedUser) {
                    dispatch(fetchViewedUserByEmail(viewedUser.email));
                }
                break;

            case ActionType.ResolveNameConflictAddFolder:
                if (handleNameConflictInFolder(
                    files,
                    id,
                    trimmedTitle,
                    ActionType.ResolveNameConflictAddFolder,
                    handleOpenModalByReason
                )) return;
                dispatch(createFile(createFilePayload(
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
                    handleOpenModalByReason
                )) return;
                if (copyPasteActions.copiedFile) {
                    dispatch(updateFileName({
                        id: copyPasteActions.copiedFile.id as number,
                        name: trimmedTitle
                    }));
                }
                break;

            default:
                return;
        }

        setModalValue('');
        setIsModalOpen(false);
        setModalOpenState({reason: null, id: null, title: null});
    }, [files, dispatch, handleOpenModalByReason, viewedUser, copyPasteActions]);

    const handleOpenRenameModal = useCallback((file: CreateFilePayload) => {
        handleOpenModalByReason({reason: ActionType.RenameFile, id: file.id, title: 'Rename file'});
        setModalValue(file.name);
    }, [handleOpenModalByReason]);

    const handleCloseModal = useCallback(() => {
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
        ...copyPasteActions,
        isModalOpen,
        setIsModalOpen,
        modalValue,
        modalError,
        setModalError,
        setModalValue,
        modalOpenState,
        setModalOpenState,
        modalInputRef,
        handleConfirmModalByReason,
        handleOpenModalByReason,
        handleOpenRenameModal,
        handleCloseModal,
        isNameConflictReason,
    };
}