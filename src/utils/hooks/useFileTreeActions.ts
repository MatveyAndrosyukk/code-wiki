import {useDispatch} from "react-redux";
import {CreateFilePayload} from "../../store/thunks/createFileOnServer";
import {AppDispatch} from "../../store";
import {changeFileLikesOnServer, ChangeFileLikesPayload} from "../../store/thunks/changeFileLikesOnServer";
import useDeleteFileActions from "./useDeleteFileActions";
import useModalActions from "./useModalActions";

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

export default function useFileTreeActions(files: CreateFilePayload[]) {
    const dispatch = useDispatch<AppDispatch>();
    const deleteFileActions = useDeleteFileActions()
    const modalActions = useModalActions(files)

    const handleLikeFile = (dto: ChangeFileLikesPayload) => {
        return dispatch(changeFileLikesOnServer(dto))
    }

    return {
        ...modalActions.clipboard,
        isModalOpen: modalActions.isModalOpen,
        setIsModalOpen: modalActions.setIsModalOpen,
        modalValue: modalActions.modalValue,
        setModalValue: modalActions.setModalValue,
        modalOpenState: modalActions.modalOpenState,
        setModalOpenState: modalActions.modalOpenState,
        modalInputRef: modalActions.modalInputRef,
        onModalConfirmByReason: modalActions.onModalConfirmByReason,
        onOpenModalByReason: modalActions.onOpenModalByReason,
        onOpenRenameModal: modalActions.onOpenRenameModal,
        onCloseModal: modalActions.onCloseModal,
        isNameConflictReason: modalActions.isNameConflictReason,
        deleteModalState: deleteFileActions.deleteModalState,
        onDeleteFile: deleteFileActions.onDeleteFileConfirm,
        onCancelDeleteFile: deleteFileActions.onDeleteFileCancel,
        onOpenDeleteModal: deleteFileActions.onOpenDeleteModal,
        onLikeFile: handleLikeFile,
    }
}