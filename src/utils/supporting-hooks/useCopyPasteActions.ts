import {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {createFile} from "../../store/thunks/files/createFile";
import {ActionType} from "./useModalActions";
import {File} from "../../types/file";


export interface CopyPasteState {
    copiedFile: File | null;
    setCopiedFile: (file: File | null) => void;
    handleCopyFile: (file: File) => void;
    handlePasteFile: (id: number | null) => void;
}

export default function useCopyPasteActions(
    files: File[],
    openModalByReason: ({reason, id, title}: { reason: ActionType, id: number | null, title: string }) => void,
    checkIfNameExists: (files: File[], folderId: number | null, name: string) => boolean
): CopyPasteState {
    const dispatch = useDispatch<AppDispatch>();
    const [copiedFile, setCopiedFile] = useState<File | null>(null);

    const handleCopyFile = useCallback((file: File) => {
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