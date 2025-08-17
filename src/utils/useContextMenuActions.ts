import React from "react";
import {File} from "../types/file";
import {CreateFilePayload} from "../store/thunks/createFileOnServer";

export default function useContextMenuActions(){

    const [contextMenuState, setContextMenuState] = React.useState<{
        visible: boolean,
        clickX: number,
        clickY: number,
        file: CreateFilePayload | null;
    }>({visible: false, clickX: 0, clickY: 0, file: null});

    const openContextMenuHandler = (event: React.MouseEvent, file: File) => {
        event.preventDefault();
        setContextMenuState({
            visible: true,
            clickX: event.clientX,
            clickY: event.clientY,
            file,
        });
    };

    const closeContextMenuHandler = () => {
        setContextMenuState({...contextMenuState, visible: false});
    }

    return {
        contextMenuState,
        setContextMenuState,
        onOpenContextMenu: openContextMenuHandler,
        onCloseContextMenu: closeContextMenuHandler,
    }
}