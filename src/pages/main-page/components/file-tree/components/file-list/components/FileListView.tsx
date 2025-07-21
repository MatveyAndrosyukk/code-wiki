import React from 'react';
import {File, FileStatus, FileType} from "../../../../../../../types/file";
import OpenedImg from '../images/file-list-opened.svg'
import ClosedImg from '../images/file-list-closed.svg'
import FileImg from '../images/file-list-file.svg'
import Line from '../images/file-list-line.svg'
import ChildLine from '../images/file-list-child-line.svg'
import LastChildLine from '../images/file-list-last-child-line.svg'
import styles from '../FileList.module.css';

interface FileListViewProps {
    nodes: File[];
    level?: number;
    ancestors?: boolean[];
    onTryToOpenFile: (id: number) => void;
    onFolderClick: (id: number) => void;
    contextMenuActions: any;
}

const FileListView: React.FC<FileListViewProps> = ({
                                                       nodes,
                                                       level = 0,
                                                       ancestors = [],
                                                       onTryToOpenFile,
                                                       onFolderClick,
                                                       contextMenuActions,
                                                   }) => {
    return (
        <>
            {nodes.map((node, idx) => {
                const isLast = idx === nodes.length - 1;
                const linesBlock = (
                    <span className={styles['fileList__node-lineBlock']}>
            {ancestors.slice(1).map((hasSibling, i) =>
                hasSibling ? (
                    <span key={i} className={styles['fileList__node-line']}>
                  <img style={{width: 2}} src={Line} alt="line" />
                </span>
                ) : (
                    <span key={i} className={styles['fileList__node-space']} />
                )
            )}
                        {level > 0 && (() => {
                            const lineSrc = isLast ? LastChildLine : ChildLine;
                            return (
                                <span className={styles['fileList__node-line']}>
                  <img style={{width: 10}} src={lineSrc} alt="line" />
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
                                    onContextMenu={(e) => contextMenuActions.onOpenContextMenu(e, node)}
                                    onClick={() => onFolderClick(node.id)}
                                    style={{display: 'flex', alignItems: 'center'}}
                                >
                                    <img src={node.status === FileStatus.Opened ? OpenedImg : ClosedImg} alt="File Status" />
                                    {node.name}
                                </div>
                            ) : (
                                <div
                                    className={styles['fileList__node-file']}
                                    onContextMenu={(e) => contextMenuActions.onOpenContextMenu(e, node)}
                                    style={{fontWeight: node.status === FileStatus.Opened ? 'bold' : 'normal'}}
                                    onClick={() => onTryToOpenFile(node.id)}
                                >
                                    <img src={FileImg} alt="File" /> {node.name}
                                </div>
                            )}
                        </div>

                        {node.type === FileType.Folder &&
                            node.status === FileStatus.Opened &&
                            node.children &&
                            <FileListView
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