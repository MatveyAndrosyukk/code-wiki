import {useState} from "react";
import {CreateFilePayload} from "../../store/thunks/createFileOnServer";
import {deleteFileOnServer} from "../../store/thunks/deleteFileOnServer";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";

export default function useDeleteFileActions(){
    const dispatch = useDispatch<AppDispatch>();
    const [deleteModalState, setDeleteModalState] = useState<{ open: boolean, file: CreateFilePayload | null }>({
        open: false,
        file: null
    });

    const openDeleteModalHandler = (file: CreateFilePayload) => {
        setDeleteModalState({open: true, file})
    }

    const deleteFileConfirmHandler = () => {
        if (!deleteModalState.file) return;
        dispatch(deleteFileOnServer(deleteModalState.file.id as number));
        setDeleteModalState({open: false, file: null})
    }

    const deleteFileCancelHandler = () => {
        setDeleteModalState({open: false, file: null})
    }

    return {
        deleteModalState,
        onOpenDeleteModal: openDeleteModalHandler,
        onDeleteFileConfirm: deleteFileConfirmHandler,
        onDeleteFileCancel: deleteFileCancelHandler,
    }
}