import {useDispatch} from "react-redux";
import {useState} from "react";
import {openFile} from "../../../store/slices/fileTreeSlice";

export default function useEditFileViewActions() {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [tryToSwitch, setTryToSwitch] = useState(false);
    const [pendingFileId, setPendingFileId] = useState<number | null>(null);

    const handleTryToSwitchFile = (targetFileId: number) => {
        if (isEditing && dirty) {
            setTryToSwitch(true);
            setPendingFileId(targetFileId);
        } else {
            setIsEditing(false);
            setDirty(false);
            setTryToSwitch(false);
            setPendingFileId(null);
            dispatch(openFile({id: targetFileId}))
        }
    };

    const handleConfirmSwitch = () => {
        if (pendingFileId !== null) {
            dispatch(openFile({id: pendingFileId}))
            setIsEditing(false);
            setDirty(false);
            setTryToSwitch(false);
            setPendingFileId(null);
        }
    };

    const handleRejectSwitch = () => {
        setTryToSwitch(false);
        setPendingFileId(null);
    };

    return {
        isEditing,
        setIsEditing,
        dirty,
        setDirty,
        tryToSwitch,
        setTryToSwitch,
        pendingFileId,
        setPendingFileId,
        onTryToSwitchFile: handleTryToSwitchFile,
        onRejectSwitch: handleRejectSwitch,
        onConfirmSwitch: handleConfirmSwitch
    }
}