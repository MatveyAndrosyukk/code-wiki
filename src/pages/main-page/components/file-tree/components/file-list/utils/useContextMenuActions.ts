import {useDispatch} from "react-redux";
import React from "react";
import {File} from "../../../../../../../types/file";

export default function useContextMenuActions(){

    // Состояние контекстного меню.
    const [contextMenu, setContextMenu] = React.useState<{
        visible: boolean,
        x: number,
        y: number,
        file: File | null;
    }>({visible: false, x: 0, y: 0, file: null});

    // Открывает контекстное меню там, где нажал пользователь.
    const openContextMenuHandler = (event: React.MouseEvent, file: File) => {
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            file,
        });
    };

    // Закрывает контекстное меню.
    const closeContextMenuHandler = () => {
        setContextMenu({...contextMenu, visible: false});
    }

    return {
        contextMenu,
        setContextMenu,
        onOpenContextMenu: openContextMenuHandler,
        onCloseContextMenu: closeContextMenuHandler,
    }
}