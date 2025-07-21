import {useDispatch} from "react-redux";
import {useState} from "react";
import {openFile} from "../../../store/slices/fileTreeSlice";

export default function useEditFileViewActions() {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [isFileContentChanged, setIsFileContentChanged] = useState(false);
    const [isTryToSwitchWhileEditing, setIsTryToSwitchWhileEditing] = useState(false);
    const [switchedFileId, setSwitchedFileId] = useState<number | null>(null);

    const handleTryToOpenFile = (targetFileId: number) => {
        if (isEditing && isFileContentChanged) {
            setIsTryToSwitchWhileEditing(true);
            setSwitchedFileId(targetFileId);
        } else {
            setIsEditing(false);
            setIsFileContentChanged(false);
            setIsTryToSwitchWhileEditing(false);
            setSwitchedFileId(null);
            dispatch(openFile({id: targetFileId}))
        }
    };

    const handleConfirmSwitch = () => {
        if (switchedFileId !== null) {
            dispatch(openFile({id: switchedFileId}))
            setIsEditing(false);
            setIsFileContentChanged(false);
            setIsTryToSwitchWhileEditing(false);
            setSwitchedFileId(null);
        }
    };

    const handleRejectSwitch = () => {
        setIsTryToSwitchWhileEditing(false);
        setSwitchedFileId(null);
    };

    return {
        isEditing,
        setIsEditing,
        isFileContentChanged,
        setIsFileContentChanged,
        isTryToSwitchWhileEditing,
        setIsTryToSwitchWhileEditing,
        switchedFileId,
        setSwitchedFileId,
        onTryToOpenFile: handleTryToOpenFile,
        onRejectSwitch: handleRejectSwitch,
        onConfirmSwitch: handleConfirmSwitch
    }
}