import {useDispatch} from "react-redux";
import {Dispatch, SetStateAction, useCallback, useState} from "react";
import {openFile} from "../../store/slices/fileTreeSlice";
import {updateFileContent} from "../../store/thunks/files/updateFileContent";
import extractImagesName from "../functions/extractImageNames";
import {deleteExtraImagesAsync} from "../../services/deleteExtraImagesAsync";
import {AppDispatch} from "../../store";

export interface EditFileViewState {
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    isFileContentChanged: boolean;
    setIsFileContentChanged: Dispatch<SetStateAction<boolean>>;
    isTryToSwitchWhileEditing: boolean;
    setIsTryToSwitchWhileEditing: Dispatch<SetStateAction<boolean>>;
    switchedFileId: number | null;
    setSwitchedFileId: Dispatch<SetStateAction<number | null>>;
    contentError: string;
    setContentError: Dispatch<SetStateAction<string>>;
    handleTryToOpenFile: (targetFileId: number | null) => void;
    handleRejectSwitch: () => void;
    handleConfirmSwitch: () => void;
    handleSaveEditedFileChanges: (
        fileId: number,
        newContent: string,
        addedImages: string[],
        editorEmail?: string
    ) => Promise<void>;
    handleCancelEditedFileChanges: (
        contentBeforeEdition: string,
        addedImages: string[],
    ) => Promise<void>;
}

export default function useEditFileActions(): EditFileViewState {
    const dispatch = useDispatch<AppDispatch>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isFileContentChanged, setIsFileContentChanged] = useState<boolean>(false);
    const [isTryToSwitchWhileEditing, setIsTryToSwitchWhileEditing] = useState<boolean>(false);
    const [switchedFileId, setSwitchedFileId] = useState<number | null>(null);
    const [contentError, setContentError] = useState<string>('');

    const handleTryToOpenFile = useCallback((targetFileId: number | null) => {
        if (isEditing && isFileContentChanged) {
            setIsTryToSwitchWhileEditing(true);
            setSwitchedFileId(targetFileId);
        } else {
            setIsEditing(false);
            setIsFileContentChanged(false);
            setIsTryToSwitchWhileEditing(false);
            setSwitchedFileId(null);
            dispatch(openFile({id: targetFileId}));
        }
    }, [isEditing, isFileContentChanged, dispatch, setIsEditing, setIsFileContentChanged, setIsTryToSwitchWhileEditing, setSwitchedFileId]);

    const handleConfirmSwitch = useCallback(() => {
        if (switchedFileId !== null) {
            dispatch(openFile({id: switchedFileId}));
            setIsEditing(false);
            setIsFileContentChanged(false);
            setIsTryToSwitchWhileEditing(false);
            setSwitchedFileId(null);
        }
    }, [switchedFileId, dispatch, setIsEditing, setIsFileContentChanged, setIsTryToSwitchWhileEditing, setSwitchedFileId]);

    const handleRejectSwitch = useCallback(() => {
        setIsTryToSwitchWhileEditing(false);
        setSwitchedFileId(null);
    }, [setIsTryToSwitchWhileEditing, setSwitchedFileId]);

    const handleSaveEditedFileChanges = useCallback(async (
        fileId: number,
        newContent: string,
        addedImages: string[],
        editorEmail?: string
    ) => {
        if (!editorEmail) {
            console.error('Editor email is required');
            return;
        }
        if (contentError) return;

        try {
            await dispatch(updateFileContent({
                id: fileId,
                content: newContent,
                editor: editorEmail
            })).unwrap();

            const savedImages = extractImagesName(newContent);
            const extraImages = addedImages.filter(image => !savedImages.includes(image));

            if (extraImages.length > 0) {
                await deleteExtraImagesAsync(extraImages);
            }

            setIsEditing(false);
            setIsFileContentChanged(false);

        } catch (error) {
            console.error('Ошибка сохранения:', error);
            throw error;
        }
    }, [contentError, dispatch]);

    const handleCancelEditedFileChanges = useCallback(async (
        contentBeforeEdition: string,
        addedImages: string[]) => {
        if (addedImages.length > 0) {
            const savedImages: string[] = extractImagesName(contentBeforeEdition || '');
            const extraImages = addedImages.filter(image => !savedImages.includes(image));
            await deleteExtraImagesAsync(extraImages);
        }

        setIsEditing(false)
        setIsFileContentChanged(false)
    }, [setIsEditing, setIsFileContentChanged])

    return {
        isEditing,
        setIsEditing,
        isFileContentChanged,
        setIsFileContentChanged,
        isTryToSwitchWhileEditing,
        setIsTryToSwitchWhileEditing,
        switchedFileId,
        setSwitchedFileId,
        contentError,
        setContentError,
        handleTryToOpenFile,
        handleRejectSwitch,
        handleConfirmSwitch,
        handleSaveEditedFileChanges,
        handleCancelEditedFileChanges
    }
}