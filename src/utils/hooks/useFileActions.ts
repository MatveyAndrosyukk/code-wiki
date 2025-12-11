import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {ChangeFileLikesPayload, toggleFileLikes} from "../../store/thunks/files/toggleFileLikes";
import useDeleteFileActions, {DeleteFileState} from "../supporting-hooks/useDeleteFileActions";
import useModalActions, {ModalActionsState} from "../supporting-hooks/useModalActions";
import useEditFileActions, {EditFileViewState} from "../supporting-hooks/useEditFileActions";
import {useCallback} from "react";
import {User} from "../../store/slices/userSlice";
import {File} from "../../types/file";

export type FileActionsState = DeleteFileState & ModalActionsState & EditFileViewState & {
    handleLikeFile: (dto: ChangeFileLikesPayload) => any;
}

export default function useFileActions(
    files: File[],
    viewedUser: User | null,
): FileActionsState {
    const dispatch = useDispatch<AppDispatch>();
    const deleteFileState = useDeleteFileActions(viewedUser)
    const modalState = useModalActions(files, viewedUser)
    const editFileState = useEditFileActions()

    const handleLikeFile = useCallback((dto: ChangeFileLikesPayload) => {
        return dispatch(toggleFileLikes(dto));
    }, [dispatch]);

    return {
        ...modalState,
        ...deleteFileState,
        ...editFileState,
        handleLikeFile,
    }
}