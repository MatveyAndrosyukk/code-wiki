import React from 'react';
import {FileStatus, FileType} from "../../../../../../../../types/file";
import OpenedImg from '../../images/file-list-opened.svg'
import ClosedImg from '../../images/file-list-closed.svg'
import FileImg from '../../images/file-list-file.svg'
import Line from '../../images/file-list-line.svg'
import ChildLine from '../../images/file-list-child-line.svg'
import LastChildLine from '../../images/file-list-last-child-line.svg'
import styles from '../../FileList.module.css';
import {CreateFilePayload} from "../../../../../../../../store/thunks/createFileOnServer";
import {User} from "../../../../../../../../store/slices/userSlice";

interface FileListViewProps {
    nodes: CreateFilePayload[];
    level?: number;
    ancestors?: boolean[];
    onTryToOpenFile: (id: number | null) => void;
    onFolderClick: (id: number | null) => void;
    contextMenuActions: any;
    isLoggedIn: boolean;
    emailParam: string | undefined;
    user: User | null;
}

const FileListView: React.FC<FileListViewProps> = (
    {
        nodes,
        level = 0,
        ancestors = [],
        onTryToOpenFile,
        onFolderClick,
        contextMenuActions,
        isLoggedIn,
        emailParam,
        user,
    }) => {
    const isUserCanEdit = () => {
        if (!isLoggedIn && !emailParam) {
            return true
        }
        const isUserEditor = user?.whoCanEdit.some(user => user.email === localStorage.getItem('email'));
        const isUserEqualsLoggedIn = user?.email === localStorage.getItem('email');
        return isUserEditor || isUserEqualsLoggedIn;

    }

    const openContextMenuHandler = (
        e: React.MouseEvent<HTMLDivElement>,
        node: CreateFilePayload
    ) => {
        if (isUserCanEdit()) {
            contextMenuActions.onOpenContextMenu(e, node)
        }
        return
    }

    return (
        <>
            {nodes.map((node, idx) => {
                const isLast = idx === nodes.length - 1;
                const linesBlock = (
                    <span className={styles['fileList__node-lineBlock']}>
            {ancestors.slice(1).map((hasSibling, i) =>
                hasSibling ? (
                    <span key={i} className={styles['fileList__node-line']}>
                  <img style={{width: 2}} src={Line} alt="line"/>
                </span>
                ) : (
                    <span key={i} className={styles['fileList__node-space']}/>
                )
            )}
                        {level > 0 && (() => {
                            const lineSrc = isLast ? LastChildLine : ChildLine;
                            return (
                                <span className={styles['fileList__node-line']}>
                  <img style={{width: 10}} src={lineSrc} alt="line"/>
                </span>
                            )
                        })()}
          </span>
                );

                return (
                    <div className={styles['fileList__node']} style={{marginLeft: 0}} key={node.id}>
                        <div className={styles['fileList__node-container']}>
                            {linesBlock}
                            {node.type === FileType.Folder ? (
                                <div
                                    className={styles['fileList__node-folder']}
                                    onContextMenu={(e) => openContextMenuHandler(e, node)}
                                    onClick={() => onFolderClick(node.id)}
                                    style={{display: 'flex', alignItems: 'center'}}
                                >
                                    <img src={node.status === FileStatus.Opened ? OpenedImg : ClosedImg}
                                         alt="File Status"/>
                                    {node.name}
                                </div>
                            ) : (
                                <div
                                    className={styles['fileList__node-file']}
                                    onContextMenu={(e) => contextMenuActions.onOpenContextMenu(e, node)}
                                    style={{fontWeight: node.status === FileStatus.Opened ? 'bold' : 'normal'}}
                                    onClick={() => onTryToOpenFile(node.id)}
                                >
                                    <img src={FileImg} alt="File"/> {node.name}
                                </div>
                            )}
                        </div>

                        {node.type === FileType.Folder &&
                            node.status === FileStatus.Opened &&
                            node.children &&
                            <FileListView
                                user={user}
                                emailParam={emailParam}
                                isLoggedIn={isLoggedIn}
                                nodes={node.children}
                                level={level + 1}
                                ancestors={[...ancestors, !isLast]}
                                onTryToOpenFile={onTryToOpenFile}
                                onFolderClick={onFolderClick}
                                contextMenuActions={contextMenuActions}
                            />}
                    </div>
                )
            })}
        </>
    );
}

export default FileListView;