import {files} from "../../types/mock-objects/files";
import {File, FileStatus, FileType} from "../../types/file";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// Из всех файлов находит нужный по id и применяет переданную функцию updater.
function findAndUpdate(
    nodes: File[],
    id: number,
    updater: (node: File, idx: number, arr: File[]) => boolean | void
): boolean {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.id === id) {
            updater(node, i, nodes);
            return true;
        }
        if (node.children && node.children.length > 0) {
            if (findAndUpdate(node.children, id, updater)) return true;
        }
    }
    return false;
}

// У скопированного файла изменяется все id по вложенности.
function deepCloneWithNewIds(file: File): File {
    const newId = Date.now() + Math.floor(Math.random() * 1000000);
    return {
        ...file,
        id: newId,
        children: file.children
            ? file.children.map(child => deepCloneWithNewIds(child))
            : [],
    };
}

// Рекурсивно закрывает все файлы.
function closeAllFiles(nodes: File[]): File[] {
    return nodes.map(node => {
        const newNode = {...node};
        if (newNode.type === FileType.File) {
            newNode.status = FileStatus.Closed;
        }
        if (newNode.children) {
            newNode.children = closeAllFiles(newNode.children);
        }
        return newNode;
    });
}

// Закрывает всех children у нажатой папки.
function closeAllChildren(nodes: File[]): File[] {
    return nodes.map(node => ({
        ...node,
        status: node.type === FileType.Folder ? FileStatus.Closed : node.status,
        children: node.children ? closeAllChildren(node.children) : [],
    }));
}

function deleteById(nodes: File[], id: number): File[] {
    return nodes
        .filter(node => node.id !== id)
        .map(node => ({
            ...node,
            children: node.children ? deleteById(node.children, id) : [],
        }));
}

// Тип состояния.
interface FileTreeState {
    files: File[];
}

// Состояние.
const initialState: FileTreeState = {
    files: files,
}

// Редьюсеры для массива files.
const fileTreeSlice = createSlice({
    name: 'fileTree',
    initialState,
    reducers: {
        // Открывает выбранный файл и закрывает остальные.
        openFile(state, action: PayloadAction<{ id: number }>) {
            state.files = closeAllFiles(state.files);

            findAndUpdate(state.files, action.payload.id, (node) => {
                if (node.type === FileType.File) {
                    node.status = FileStatus.Opened;
                }
            })
        },
        // Изменяет status папок и их children при нажатии на Closed или Opened.
        toggleFolder(state, action: PayloadAction<{ id: number }>) {
            function toggle(nodes: File[]): File[] {
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
        // Добавляет корневую папку с переданным названием.
        createRootFolder(state, action: PayloadAction<{ title: string }>) {
            const newFolder: File = {
                id: Date.now(), // или nanoid() если подключите
                name: action.payload.title,
                type: FileType.Folder,
                status: FileStatus.Closed,
                author: 'matvey',
                content: "",
                likes: 0,
                children: [],
            };
            state.files.push(newFolder);
        },
        // Вставляет скопированный файл в переданную папку по id.
        pasteFile(state, action: PayloadAction<{ targetFolderId: number; file: File }>) {
            findAndUpdate(state.files, action.payload.targetFolderId, (node) => {
                if (node.type === FileType.Folder) {
                    const newFile = deepCloneWithNewIds(action.payload.file);
                    node.children = [...(node.children || []), newFile];
                }
            });
        },
        //Создает папку в переданной по id папке.
        addFolder(state, action: PayloadAction<{ parentId: number; title: string }>) {
            findAndUpdate(state.files, action.payload.parentId, (node) => {
                if (node.type === FileType.Folder) {
                    const newFolder: File = {
                        id: Date.now(),
                        name: action.payload.title,
                        type: FileType.Folder,
                        status: FileStatus.Closed,
                        author: 'user',
                        content: "",
                        likes: 0,
                        children: [],
                    };
                    node.children = [...(node.children || []), newFolder];
                }
            });
        },
        //Создает файл в переданной по id папке.
        addFile(state, action: PayloadAction<{ parentId: number; title: string }>) {
            findAndUpdate(state.files, action.payload.parentId, (node) => {
                if (node.type === FileType.Folder) {
                    const newFolder: File = {
                        id: Date.now(),
                        name: action.payload.title,
                        type: FileType.File,
                        status: FileStatus.Closed,
                        author: 'user',
                        content: "",
                        likes: 0,
                        children: [],
                    };
                    node.children = [...(node.children || []), newFolder];
                }
            });
        },
        deleteFile(state, action: PayloadAction<{ id: number }>) {
            state.files = deleteById(state.files, action.payload.id);
        },
    },

});

export const {openFile, toggleFolder, createRootFolder, pasteFile, addFolder, addFile, deleteFile} = fileTreeSlice.actions;
export default fileTreeSlice.reducer;

