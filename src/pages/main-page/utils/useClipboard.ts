import {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {pasteFile} from "../../../store/slices/fileTreeSlice";
import {File} from "../../../types/file";
import {ActionType} from "./useFileTreeActions";


export default function useClipboard(
    files: File[],
    openModal: ({reason, id}: { reason: ActionType, id: number | null }) => void,
    checkIfNameExists: (files: File[], folderId: number, name: string) => boolean
) {
    const [copiedFile, setCopiedFile] = useState<File | null>(null);
    const dispatch = useDispatch();

    // Copy selected file from context menu.
    const handleCopyFile = useCallback((file: File) => {
        setCopiedFile(file);
    }, []);

    // Paste selected file from context menu.
    const handlePasteFile = useCallback((id: number) => {
        if (!copiedFile) return;
        if (checkIfNameExists(files, id, copiedFile.name)) {
            openModal({reason: ActionType.ResolveNameConflictPaste, id});
        } else {
            dispatch(pasteFile({targetFolderId: id, file: copiedFile}));
        }
    }, [copiedFile, dispatch, files, checkIfNameExists, openModal]);

    return {
        copiedFile,
        onCopyFile: handleCopyFile,
        onPasteFile: handlePasteFile,
    }
}