import {useDispatch} from "react-redux";
import {Dispatch, SetStateAction, useCallback, useState} from "react";
import {openFile} from "../../store/slices/fileTreeSlice";

export interface EditFileViewState {
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    isFileContentChanged: boolean;
    setIsFileContentChanged: Dispatch<SetStateAction<boolean>>;
    isTryToSwitchWhileEditing: boolean;
    setIsTryToSwitchWhileEditing: Dispatch<SetStateAction<boolean>>;
    switchedFileId: number | null
    setSwitchedFileId: Dispatch<SetStateAction<number | null>>
    handleTryToOpenFile: (targetFileId: number | null) => void;
    handleRejectSwitch: () => void;
    handleConfirmSwitch: () => void;
}

export default function useEditFileActions(): EditFileViewState {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isFileContentChanged, setIsFileContentChanged] = useState<boolean>(false);
    const [isTryToSwitchWhileEditing, setIsTryToSwitchWhileEditing] = useState<boolean>(false);
    const [switchedFileId, setSwitchedFileId] = useState<number | null>(null);

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

    return {
        isEditing,
        setIsEditing,
        isFileContentChanged,
        setIsFileContentChanged,
        isTryToSwitchWhileEditing,
        setIsTryToSwitchWhileEditing,
        switchedFileId,
        setSwitchedFileId,
        handleTryToOpenFile,
        handleRejectSwitch,
        handleConfirmSwitch
    }
}