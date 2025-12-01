import React, {Dispatch, SetStateAction, useCallback} from "react";
import {CreateFilePayload} from "../../store/thunks/files/createFile";

export interface OpenedContextMenuState {
    visible: boolean,
    clickX: number,
    clickY: number,
    file: CreateFilePayload | null;
}

export interface ContextMenuState {
    contextMenuState: OpenedContextMenuState;
    setContextMenuState: Dispatch<SetStateAction<OpenedContextMenuState>>;
    handleOpenContextMenu: (event: React.MouseEvent, file: CreateFilePayload) => void;
    handleCloseContextMenu: () => void;
}

export default function useContextMenuActions(): ContextMenuState {
    const [contextMenuState, setContextMenuState] = React.useState<OpenedContextMenuState>({
        visible: false,
        clickX: 0,
        clickY: 0,
        file: null
    });

    const handleOpenContextMenu = useCallback((event: React.MouseEvent, file: CreateFilePayload) => {
        event.preventDefault();
        setContextMenuState({
            visible: true,
            clickX: event.clientX,
            clickY: event.clientY,
            file,
        });
    }, [setContextMenuState]);

    const handleCloseContextMenu = useCallback(() => {
        setContextMenuState(prev => ({ ...prev, visible: false }));
    }, [setContextMenuState]);

    return {
        contextMenuState,
        setContextMenuState,
        handleOpenContextMenu,
        handleCloseContextMenu,
    }
}