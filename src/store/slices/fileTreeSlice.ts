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

// Удаляет файл/папку по id.
function deleteById(nodes: File[], id: number): File[] {
    return nodes
        .filter(node => node.id !== id)
        .map(node => ({
            ...node,
            children: node.children ? deleteById(node.children, id) : [],
        }));
}

// Функция для поиска пути к узлу по id
function findPathToNode(nodes: File[], targetId: number, path: number[] = []): number[] | null {
    for (const node of nodes) {
        const currentPath = [...path, node.id];
        if (node.id === targetId) {
            return currentPath;
        }
        if (node.children && node.children.length > 0) {
            const result = findPathToNode(node.children, targetId, currentPath);
            if (result) return result;
        }
    }
    return null;
}

// Функция для поиска узла по id, возвращает File или null
function findNode(nodes: File[], targetId: number): File | null {
    for (const node of nodes) {
        if (node.id === targetId) return node;
        if (node.children && node.children.length > 0) {
            const found = findNode(node.children, targetId);
            if (found) return found;
        }
    }
    return null;
}

// Открыть папки по пути, не закрывая другие папки
function openFoldersOnPathPreserveOthers(nodes: File[], pathIds: number[]): File[] {
    return nodes.map(node => {
        const newNode = { ...node };
        if (newNode.type === FileType.Folder) {
            if (pathIds.includes(newNode.id)) {
                newNode.status = FileStatus.Opened;
            }
            if (newNode.children && newNode.children.length > 0) {
                newNode.children = openFoldersOnPathPreserveOthers(newNode.children, pathIds);
            }
        }
        return newNode;
    });
}

// Закрыть все файлы, кроме файла с id = openedFileId (если передан)
function closeAllFilesExcept(nodes: File[], openedFileId: number | null): File[] {
    return nodes.map(node => {
        const newNode = { ...node };
        if (newNode.type === FileType.File) {
            newNode.status = newNode.id === openedFileId ? FileStatus.Opened : FileStatus.Closed;
        }
        if (newNode.children && newNode.children.length > 0) {
            newNode.children = closeAllFilesExcept(newNode.children, openedFileId);
        }
        return newNode;
    });
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
                    const  pastedFile = {...newFile, status: FileStatus.Closed};
                    node.children = [...(node.children || []), pastedFile];
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
        openPathToNode(state, action: PayloadAction<{ id: number }>) {
            const targetId = action.payload.id;

            // Найти путь к узлу
            const path = findPathToNode(state.files, targetId);
            if (!path) return;

            // Найти сам узел
            const targetNode = findNode(state.files, targetId);
            if (!targetNode) return;

            if (targetNode.type === FileType.File) {
                // Для файла: закрыть все файлы кроме этого, открыть папки по пути
                state.files = closeAllFilesExcept(state.files, targetId);
                state.files = openFoldersOnPathPreserveOthers(state.files, path);
            } else if (targetNode.type === FileType.Folder) {
                // Для папки: открыть папки по пути, не трогая остальные папки и файлы
                state.files = openFoldersOnPathPreserveOthers(state.files, path);
            }
        },
        updateFileContent(state, action: PayloadAction<{ id: number; content: string }>) {
            const { id, content } = action.payload;
            function update(nodes: File[]) {
                for (const node of nodes) {
                    if (node.id === id && node.type === FileType.File) {
                        node.content = content;
                        return true;
                    }
                    if (node.children && node.children.length > 0) {
                        if (update(node.children)) return true;
                    }
                }
                return false;
            }
            update(state.files);
        },
        renameFile(state, action: PayloadAction<{ id: number; newName: string }>) {
            const { id, newName } = action.payload;
            function updateName(nodes: File[]): boolean {
                for (const node of nodes) {
                    if (node.id === id) {
                        node.name = newName;
                        return true; // нашли и обновили
                    }
                    if (node.children && node.children.length > 0) {
                        if (updateName(node.children)) return true;
                    }
                }
                return false;
            }
            updateName(state.files);
        },
    },

});

export const {
    openFile,
    toggleFolder,
    createRootFolder,
    pasteFile,
    addFolder,
    addFile,
    deleteFile,
    openPathToNode,
    updateFileContent,
    renameFile,
} = fileTreeSlice.actions;
export default fileTreeSlice.reducer;

