import {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {ActionType} from "./useFileTreeActions";
import {AppDispatch} from "../../store";
import {createFileOnServer, CreateFilePayload} from "../../store/thunks/createFileOnServer";


export default function useCopyPasteFile(
    files: CreateFilePayload[],
    openModal: ({reason, id, title}: { reason: ActionType, id: number | null, title: string }) => void,
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
            openModal({reason: ActionType.ResolveNameConflictPaste, id, title: "Paste file"});
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