import React, {useCallback, useContext, useRef} from 'react';
import {FixedSizeList, ListChildComponentProps} from 'react-window';
import styles from './FileList.module.scss';
import {useDispatch} from 'react-redux';
import {toggleFolder} from '../../../../../../store/slices/fileTreeSlice';
import {AppContext} from '../../../../../../context/AppContext';
import useContextMenuActions from '../../../../../../utils/hooks/useContextMenuActions';
import ContextMenu from '../../../../../../ui-components/context-menu/ContextMenu';
import {useFlattenedTree} from '../../../../../../utils/hooks/useFlattenedTree';
import VirtualizedRow from './components/virtualized-row/VirtualizedRow';

interface FileListProps {
    emailParam: string | undefined;
    windowWidth: number;
}

const FileList: React.FC<FileListProps> = (
    {
        emailParam,
        windowWidth,
    }) => {
    const dispatch = useDispatch();
    const context = useContext(AppContext);
    if (!context) throw new Error('Context required');

    const {files} = context;
    const contextMenuAcState = useContextMenuActions();
    const listRef = useRef<any>(null);
    const {contextMenuState, handleCloseContextMenu} = contextMenuAcState;
    const flattenedNodes = useFlattenedTree(files);

    const onFolderClick = useCallback(
        (id: number | null) => {
            dispatch(toggleFolder({id}));
        },
        [dispatch],
    );

    const Row: React.FC<ListChildComponentProps> = ({index, style}) => (
        <div style={style}>
            <VirtualizedRow
                node={flattenedNodes[index]}
                emailParam={emailParam}
                onFolderClick={onFolderClick}
                contextMenuState={contextMenuAcState}
            />
        </div>
    );

    return (
        <div
            className={styles['file-list']}
            style={{maxHeight: windowWidth < 1270 ? '300px' : '81vh'}}
        >
            <div style={{
                height: Math.max(200, flattenedNodes.length * 27),
                overflowY: 'hidden'
            }}>
                <FixedSizeList
                    ref={listRef}
                    height={Math.max(200, flattenedNodes.length * 27) + 5}
                    itemCount={flattenedNodes.length}
                    itemSize={27}
                    width="100%"
                >
                    {Row}
                </FixedSizeList>
            </div>

            {contextMenuState.visible && contextMenuState.file && (
                <ContextMenu
                    clickX={contextMenuState.clickX}
                    clickY={contextMenuState.clickY}
                    file={contextMenuState.file}
                    onCloseContextMenu={handleCloseContextMenu}
                />
            )}
        </div>
    );
};

export default FileList;