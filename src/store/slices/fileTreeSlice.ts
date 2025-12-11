import {FileStatus, FileType} from "../../types/file";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchFilesByEmail} from "../thunks/files/fetchFilesByEmail";
import {createFile, CreateFilePayload} from "../thunks/files/createFile";
import {deleteFileById} from "../thunks/files/deleteFileById";
import {updateFileContent} from "../thunks/files/updateFileContent";
import {toggleFileLikes} from "../thunks/files/toggleFileLikes";
import {
    closeAllChildren,
    closeAllFiles,
    closeAllFilesExcept,
    deleteById,
    findAndUpdate,
    findPathToNode,
    openFoldersOnPathPreserveOthers
} from "../utils/fileTreeActionUtils";
import {findNodeById} from "../../utils/functions/modalUtils";
import {updateFileName} from "../thunks/files/updateFileName";

interface FileTreeState {
    files: CreateFilePayload[];
}

const initialState: FileTreeState = {
    files: [],
}

const fileTreeSlice = createSlice({
    name: 'fileTree',
    initialState,
    reducers: {
        clearFiles(state) {
            state.files = [];
        },
        openFile(state, action: PayloadAction<{ id: number | null }>) {
            state.files = closeAllFiles(state.files);

            findAndUpdate(state.files, action.payload.id, (node) => {
                if (node.type === FileType.File) {
                    node.status = FileStatus.Opened;
                }
            })
        },
        toggleFolder(state, action: PayloadAction<{ id: number | null }>) {
            function toggle(nodes: CreateFilePayload[]): CreateFilePayload[] {
                return nodes.map(node => {
                    if (node.id === action.payload.id && node.type === FileType.Folder) {
                        const newStatus = node.status === FileStatus.Opened ? FileStatus.Closed : FileStatus.Opened;
                        return {
                            ...node,
                            status: newStatus,
                            children: newStatus === FileStatus.Closed ? closeAllChildren(node.children ?? []) : node.children ?? [],
                        };
                    }
                    if (node.children) {
                        return {
                            ...node,
                            children: toggle(node.children),
                        };
                    }
                    return node;
                });
            }

            state.files = toggle(state.files);
        },
        openPathToNode(state, action: PayloadAction<{ id: number }>) {
            const targetId = action.payload.id;

            const path = findPathToNode(state.files, targetId);
            if (!path) return;

            const targetNode = findNodeById(state.files, targetId);
            if (!targetNode) return;

            if (targetNode.type === FileType.File) {
                state.files = closeAllFilesExcept(state.files, targetId);
                state.files = openFoldersOnPathPreserveOthers(state.files, path);
            } else if (targetNode.type === FileType.Folder) {
                state.files = openFoldersOnPathPreserveOthers(state.files, path);
            }
        },
        resetFiles(state) {
            state.files = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilesByEmail.fulfilled, (state, action) => {
                state.files = action.payload;
            })
            .addCase(fetchFilesByEmail.rejected, (state) => {
                state.files = []
            })
            .addCase(createFile.fulfilled, (state, action) => {
                const newFile = action.payload;
                const parentId =
                    newFile.parent === null
                        ? null
                        : typeof newFile.parent === 'number'
                            ? newFile.parent
                            : newFile.parent.id;

                if (parentId === null) {
                    state.files.push(newFile);
                } else {
                    findAndUpdate(state.files, parentId, (node) => {
                        if (node.type === FileType.Folder) {
                            node.children = node.children ? [...node.children, newFile] : [newFile];
                        }
                        if (node.status === FileStatus.Closed) {
                            node.status = FileStatus.Opened;
                        }
                    });
                }
            })
            .addCase(deleteFileById.fulfilled, (state, action) => {
                const deletedFileId = action.payload;
                state.files = deleteById(state.files, deletedFileId);
            })
            .addCase(updateFileContent.fulfilled, (state, action) => {
                const changedFile = action.payload;

                function update(nodes: CreateFilePayload[]) {
                    for (const node of nodes) {
                        if (node.id === changedFile.id && node.type === FileType.File) {
                            node.content = changedFile.content;
                            node.lastEditor = changedFile.lastEditor;
                            return true;
                        }
                        if (node.children && node.children.length > 0) {
                            if (update(node.children)) return true;
                        }
                    }
                    return false;
                }

                update(state.files);
            })
            .addCase(toggleFileLikes.fulfilled, (state, action) => {
                const likedFile = action.payload;

                findAndUpdate(state.files, likedFile.id, (node) => {
                    node.likes = likedFile.likes
                });
            })
            .addCase(updateFileName.fulfilled, (state, action) => {
                const renamedFile = action.payload;

                findAndUpdate(state.files, renamedFile.id, (node) => {
                    node.name = renamedFile.name;
                })
            })
    }

});

export const {
    openFile,
    toggleFolder,
    openPathToNode,
    resetFiles,
    clearFiles
} = fileTreeSlice.actions;
export default fileTreeSlice.reducer;

