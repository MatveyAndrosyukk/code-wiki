import {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {createFile, CreateFilePayload} from "../../store/thunks/files/createFile";
import {ActionType} from "./useModalActions";


export interface CopyPasteState {
    copiedFile: CreateFilePayload | null;
    setCopiedFile: (file: CreateFilePayload | null) => void;
    handleCopyFile: (file: CreateFilePayload) => void;
    handlePasteFile: (id: number | null) => void;
}

export default function useCopyPasteActions(
    files: CreateFilePayload[],
    openModalByReason: ({reason, id, title}: { reason: ActionType, id: number | null, title: string }) => void,
    checkIfNameExists: (files: CreateFilePayload[], folderId: number | null, name: string) => boolean
): CopyPasteState {
    const dispatch = useDispatch<AppDispatch>();
    const [copiedFile, setCopiedFile] = useState<CreateFilePayload | null>(null);

    const handleCopyFile = useCallback((file: CreateFilePayload) => {
        setCopiedFile(file);
    }, []);

    const handlePasteFile = useCallback((id: number | null) => {
        console.log("handlePasteFile ID: " + id)
        if (!copiedFile) return;
        if (checkIfNameExists(files, id, copiedFile.name)) {
            openModalByReason({reason: ActionType.ResolveNameConflictPaste, id, title: "Paste file"});
        } else {
            const copiedFileToSave = {
                id: null,
                status: null,
                author: localStorage.getItem('email'),
                type: copiedFile.type,
                name: copiedFile.name,
                content: copiedFile.content,
                children: copiedFile.children,
                lastEditor: copiedFile.lastEditor,
                likes: 0,
                parent: id
            }
            console.log(copiedFileToSave);
            dispatch(createFile(copiedFileToSave))
        }
    }, [copiedFile, dispatch, files, checkIfNameExists, openModalByReason]);

    return {
        copiedFile,
        setCopiedFile,
        handleCopyFile,
        handlePasteFile,
    }
}