import {useCallback, useState} from "react";
import {CreateFilePayload} from "../../store/thunks/files/createFile";
import {deleteFileById} from "../../store/thunks/files/deleteFileById";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {User} from "../../store/slices/userSlice";

export interface DeleteModalState {
    open: boolean;
    file: CreateFilePayload | null;
    user: User | null;
}

export interface DeleteFileState {
    deleteModalState: DeleteModalState;
    handleOpenDeleteModal: (file: CreateFilePayload, user: User | null) => void;
    handleConfirmDeleteFile: () => void;
    handleCancelDeleteFile: () => void;
}

export default function useDeleteFileActions(): DeleteFileState {
    const dispatch = useDispatch<AppDispatch>();
    const [deleteModalState, setDeleteModalState] = useState<DeleteModalState>({
        open: false,
        file: null,
        user: null,
    });

    const handleOpenDeleteModal = useCallback((file: CreateFilePayload, user: User | null) => {
        setDeleteModalState({ open: true, file, user });
    }, [setDeleteModalState]);

    const handleConfirmDeleteFile = useCallback(() => {
        if (!deleteModalState.file) return;
        dispatch(deleteFileById({id: deleteModalState.file?.id, email: deleteModalState.user?.email}));
        setDeleteModalState({ open: false, file: null, user: null});
    }, [deleteModalState.file, deleteModalState.user?.email, dispatch]);

    const handleCancelDeleteFile = useCallback(() => {
        setDeleteModalState({ open: false, file: null, user: null });
    }, [setDeleteModalState]);

    return {
        deleteModalState,
        handleOpenDeleteModal,
        handleConfirmDeleteFile,
        handleCancelDeleteFile,
    }
}