import {useState, useCallback} from "react";
import {useDispatch} from "react-redux";
import {pasteFile} from "../../../store/slices/fileTreeSlice";
import {File} from "../../../types/file";


export default function useClipboard(
    files: File[],
    openModal: ({reason, id}: { reason: string, id: number | null }) => void,
    checkIfNameExists: (files: File[], folderId: number, name: string) => boolean
) {
    const [copiedFile, setCopiedFile] = useState<File | null>(null);
    const dispatch = useDispatch();

    const handleCopyFile = useCallback((file: File) => {
        setCopiedFile(file);
    }, []);

    const handlePasteFile = useCallback((id: number) => {
        if (!copiedFile) return;
        if (checkIfNameExists(files, id, copiedFile.name)) {
            openModal({reason: 'resolvePasteConflict', id});
        } else {
            dispatch(pasteFile({targetFolderId: id, file: copiedFile}));
        }
    }, [copiedFile, dispatch, files, checkIfNameExists, openModal]);

    const doPaste = useCallback((id: number, file: File) => {
        dispatch(pasteFile({targetFolderId: id, file}));
    }, [dispatch]);

    return {
        copiedFile,
        handleCopyFile,
        handlePasteFile,
        doPaste,
    }
}