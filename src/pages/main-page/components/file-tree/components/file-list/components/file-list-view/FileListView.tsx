import React, {useCallback, useContext, useRef} from 'react';
import {FileStatus, FileType} from "../../../../../../../../types/file";
import OpenedImg from '../../images/file-list-opened.svg'
import ClosedImg from '../../images/file-list-closed.svg'
import {ReactComponent as FileImg} from '../../images/file-list-file.svg'
import Line from '../../images/file-list-line.svg'
import ChildLine from '../../images/file-list-child-line.svg'
import LastChildLine from '../../images/file-list-last-child-line.svg'
import styles from '../../FileList.module.scss';
import {CreateFilePayload} from "../../../../../../../../store/thunks/files/createFile";
import {AppContext} from "../../../../../../../../context/AppContext";
import {isUserCanEdit} from "../../../../../../../../utils/functions/permissions-utils/isUserCanEdit";
import {ContextMenuState} from "../../../../../../../../utils/hooks/useContextMenuActions";

interface FileListViewProps {
    level?: number;
    ancestors?: boolean[];
    onFolderClick: (id: number | null) => void;
    contextMenuState: ContextMenuState;
    emailParam: string | undefined;
    files: CreateFilePayload[]
}

const FileListView: React.FC<FileListViewProps> = (
    {
        level = 0,
        ancestors = [],
        onFolderClick,
        contextMenuState,
        emailParam,
        files
    }) => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Component can't be used without context");
    const pressTimerRef = useRef<NodeJS.Timeout | null>(null)
    const {viewedUser, authState, fileState, loggedInUser} = context;

    const {
        isLoggedIn,
    } = authState;

    const {
        handleTryToOpenFile
    } = fileState;

    const touchStartHandler = useCallback((node: CreateFilePayload, touchEvent?: React.TouchEvent) => {
        pressTimerRef.current = setTimeout(() => {
            if (isUserCanEdit(isLoggedIn, emailParam, viewedUser, loggedInUser) && touchEvent) {
                const touch = touchEvent.touches[0];
                const fakeMouseEvent = new MouseEvent('contextmenu', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    bubbles: true
                });
                contextMenuState.handleOpenContextMenu(fakeMouseEvent as any, node);
            }
        }, 500);
    }, [contextMenuState, emailParam, isLoggedIn, loggedInUser, viewedUser]);

    const touchEndHandler = useCallback(() => {
        if (pressTimerRef.current) {
            clearTimeout(pressTimerRef.current);
            pressTimerRef.current = null;
        }
    }, [])

    const openContextMenuHandler = useCallback((
        e: React.MouseEvent<HTMLDivElement>,
        node: CreateFilePayload
    ) => {
        if (isUserCanEdit(isLoggedIn, emailParam, viewedUser, loggedInUser)) {
            contextMenuState.handleOpenContextMenu(e, node);
        }
    }, [contextMenuState, emailParam, isLoggedIn, loggedInUser, viewedUser]);

    return (
        <>
            {files.map((node, idx) => {
                const isLast = idx === files.length - 1;
                const linesBlock = (
                    <span className={styles['file-list__node-line-block']}>
                {ancestors.slice(1).map((hasSibling, i) =>
                    hasSibling ? (
                        <span key={i} className={styles['file-list__node-line']}>
                            <img style={{width: 2}} src={Line} alt="line"/>
                        </span>
                    ) : (
                        <span key={i} className={styles['file-list__node-space']}/>
                    )
                )}
                        {level > 0 && (() => {
                            const lineSrc = isLast ? LastChildLine : ChildLine;
                            return (
                                <span className={styles['file-list__node-line']}>
                            <img style={{width: 10}} src={lineSrc} alt="line"/>
                        </span>
                            )
                        })()}
            </span>
                );

                return (
                    <div className={styles['file-list__node']} style={{marginLeft: 0}} key={node.id}>
                        <div className={styles['file-list__node-container']}>
                            {linesBlock}
                            {node.type === FileType.Folder ? (
                                <div
                                    className={styles['file-list__node-folder']}
                                    onContextMenu={(e) => openContextMenuHandler(e, node)}
                                    onTouchStart={(e) => touchStartHandler(node, e)}
                                    onTouchEnd={touchEndHandler}
                                    onClick={() => onFolderClick(node.id)}
                                    style={{display: 'flex', alignItems: 'center'}}
                                >
                                    <img src={node.status === FileStatus.Opened ? OpenedImg : ClosedImg}
                                         alt="File Status"/>
                                    {node.name}
                                </div>
                            ) : (
                                <div
                                    className={styles['file-list__node-file']}
                                    onContextMenu={(e) => contextMenuState.handleOpenContextMenu(e, node)}
                                    onTouchStart={(e) => touchStartHandler(node, e)}
                                    onTouchEnd={touchEndHandler}
                                    style={{fontWeight: node.status === FileStatus.Opened ? 'bold' : 'normal'}}
                                    onClick={() => handleTryToOpenFile(node.id)}
                                >
                                    <FileImg className={styles['file-list__node-image']}/> {node.name}
                                </div>
                            )}
                        </div>

                        {node.type === FileType.Folder &&
                            node.status === FileStatus.Opened &&
                            node.children &&
                            <FileListView
                                emailParam={emailParam}
                                files={node.children}
                                level={level + 1}
                                ancestors={[...ancestors, !isLast]}
                                onFolderClick={onFolderClick}
                                contextMenuState={contextMenuState}
                            />}
                    </div>
                )
            })}
        </>
    );
}

export default FileListView;