import React from 'react';
import {File, FileStatus, FileType} from "../../../../../../types/file";
import OpenedImg from './images/file-list-opened.svg'
import ClosedImg from './images/file-list-closed.svg'
import FileImg from './images/file-list-file.svg'
import Line from './images/file-list-line.svg'
import ChildLine from './images/file-list-child-line.svg'
import LastChildLine from './images/file-list-last-child-line.svg'
import styles from './FileList.module.css'
import {useDispatch} from "react-redux";
import {toggleFolder} from "../../../../../../store/slices/fileTreeSlice";
import ContextMenu from "../../../../../../ui-components/context-menu/ContextMenu";

interface FileListProps {
    files: File[]; // Все файлы.
    copiedFile: File | null; // Скопированный файл для логики отрисовки Paste.
    onFileClick: (id: number) => void; // Открывает файл и закрывает остальные.
    onOpenModal: (args: {reason: string, id: number | null}) => void; // Открывает модальное окно с опр. причиной.
    onCopyFile: (file: File) => void; // Копирует файл.
    onPasteFile: (id: number) => void; // Вставляет файл.
    onDeleteFile: (file: File) => void;
    onRenameFile: (file: File) => void;
}

const FileList: React.FC<FileListProps> = (
    {
        files,
        copiedFile,
        onFileClick,
        onCopyFile,
        onPasteFile,
        onOpenModal,
        onDeleteFile,
        onRenameFile,
    }
) => {
    const dispatch = useDispatch();

    // Состояние контекстного меню.
    const [contextMenu, setContextMenu] = React.useState<{
        visible: boolean,
        x: number,
        y: number,
        file: File | null;
    }>({visible: false, x: 0, y: 0, file: null});

    // Открывает / закрывает папку (также ее children).
    const onFolderClick = (id: number) => {
        dispatch(toggleFolder({id}))
    };

    // Открывает контекстное меню там, где нажал пользователь.
    const onContextMenuHandler = (event: React.MouseEvent, file: File) => {
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            file,
        });
    };

    // Закрывает контекстное меню.
    const closeContextMenu = () => {
        setContextMenu({...contextMenu, visible: false});
    }

    // Вся логика отрисовки файлов / папок.
    const renderTree = (
        nodes: File[],
        level = 0,
        ancestors: boolean[] = []
    ) => {
        return nodes.map((node, idx) => {
            const isLast = idx === nodes.length - 1;

            // Логика отрисовки нужных линий перед файлом / папкой.
            const linesBlock = (
                // Пропуск 1 элемента, для него line не нужна.
                <span className={styles['fileList__node-lineBlock']}>
                    {ancestors.slice(1).map((hasSibling, i) =>
                        hasSibling ? (
                            <span
                                key={i}
                                className={styles['fileList__node-line']}
                            >
                                     <img
                                         style={{width: 2}}
                                         src={Line}
                                         alt="line"
                                     />
                            </span>
                        ) : (
                            <span
                                key={i}
                                className={styles['fileList__node-space']}
                            />
                        )
                    )}

                    {level > 0 && (() => {
                        const isLast = idx === nodes.length - 1;
                        const lineSrc = isLast ? LastChildLine : ChildLine;

                        return (
                            <span
                                className={styles['fileList__node-line']}
                            >
                                     <img
                                         style={{width: 10}}
                                         src={lineSrc}
                                         alt="line"
                                     />
                            </span>
                        );
                    })()}
            </span>
            );

            return (
                // Корневой div для файла/папки первого уровня.
                <div
                    className={styles['fileList__node']}
                    style={{marginLeft: 0}}
                    key={node.id}
                >
                    {/*Контейнер для каждого файла/папки (линии, статус, название)*/}
                    <div className={styles['fileList__node-container']}>
                        {linesBlock}
                        {node.type === FileType.Folder ? (
                            <div
                                className={styles['fileList__node-folder']}
                                onContextMenu={(e) => onContextMenuHandler(e, node)}
                                onClick={() => onFolderClick(node.id)}
                                style={{display: 'flex', alignItems: 'center'}}
                            >
                                <img
                                    src={node.status === FileStatus.Opened ? OpenedImg : ClosedImg}
                                    alt="File Status"
                                />
                                {node.name}
                            </div>
                        ) : (
                            <div className={styles['fileList__node-file']}
                                 onContextMenu={(e) => onContextMenuHandler(e, node)}
                                 style={{fontWeight: node.status === FileStatus.Opened ? 'bold' : 'normal'}}
                                 onClick={() => onFileClick(node.id)}
                            >
                                <img src={FileImg} alt="File"/> {node.name}
                            </div>
                        )}
                    </div>
                    {/*Отрисовка всех children для папки*/}
                    {node.type === FileType.Folder &&
                        node.status === FileStatus.Opened &&
                        node.children &&
                        renderTree(
                            node.children,
                            level + 1,
                            [...ancestors, !isLast]
                        )}
                </div>
            );
        });
    };

    return <div className={styles['fileList']}>
        {renderTree(files)}
        {contextMenu.visible && contextMenu.file && (
            <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                file={contextMenu.file}
                copiedFile={copiedFile}
                onClose={closeContextMenu}
                onCopyFile={onCopyFile}
                onPasteFile={onPasteFile}
                onOpenModal={onOpenModal}
                onRenameFile={onRenameFile}
                onDeleteFile={onDeleteFile}
            />
        )}
    </div>;
};

export default FileList;