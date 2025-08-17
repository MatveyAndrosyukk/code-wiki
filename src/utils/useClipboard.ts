import {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {pasteFile} from "../store/slices/fileTreeSlice";
import {File} from "../types/file";
import {ActionType} from "./useFileTreeActions";
import {AppDispatch} from "../store";
import {createFileOnServer, CreateFilePayload} from "../store/thunks/createFileOnServer";


export default function useClipboard(
    files: CreateFilePayload[],
    openModal: ({reason, id}: { reason: ActionType, id: number | null }) => void,
    checkIfNameExists: (files: CreateFilePayload[], folderId: number | null, name: string) => boolean
) {
    const [copiedFile, setCopiedFile] = useState<CreateFilePayload | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const handleCopyFile = useCallback((file: CreateFilePayload) => {
        setCopiedFile(file);
    }, []);

    const handlePasteFile = useCallback((id: number | null) => {
        if (!copiedFile) return;
        if (checkIfNameExists(files, id, copiedFile.name)) {
            openModal({reason: ActionType.ResolveNameConflictPaste, id});
        } else {
            const copiedFileToSave = {
                id: null,
                status: null,
                author: localStorage.getItem('email'),
                type: copiedFile.type,
                name: copiedFile.name,
                content: copiedFile.content,
                children: copiedFile.children,
                likes: copiedFile.likes,
                parent: id
            }
            dispatch(createFileOnServer(copiedFileToSave))
        }
    }, [copiedFile, dispatch, files, checkIfNameExists, openModal]);

    return {
        copiedFile,
        onCopyFile: handleCopyFile,
        onPasteFile: handlePasteFile,
    }
}