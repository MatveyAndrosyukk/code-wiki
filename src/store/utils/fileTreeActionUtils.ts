import {CreateFilePayload} from "../thunks/createFileOnServer";
import {FileStatus, FileType} from "../../types/file";

export function findAndUpdate(
    nodes: CreateFilePayload[],
    id: number | null,
    updater: (node: CreateFilePayload, idx: number, arr: CreateFilePayload[]) => boolean | void
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

export function deepCloneWithNewIds(file: CreateFilePayload): CreateFilePayload {
    const newId = Date.now() + Math.floor(Math.random() * 1000000);
    return {
        ...file,
        id: newId,
        children: file.children
            ? file.children.map(child => deepCloneWithNewIds(child))
            : [],
    };
}

export function closeAllFiles(nodes: CreateFilePayload[]): CreateFilePayload[] {
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

export function closeAllChildren(nodes: CreateFilePayload[]): CreateFilePayload[] {
    return nodes.map(node => ({
        ...node,
        status: node.type === FileType.Folder ? FileStatus.Closed : node.status,
        children: node.children ? closeAllChildren(node.children) : [],
    }));
}

export function deleteById(nodes: CreateFilePayload[], id: number | null): CreateFilePayload[] {
    return nodes
        .filter(node => node.id !== id)
        .map(node => ({
            ...node,
            children: node.children ? deleteById(node.children, id) : [],
        }));
}

export function findPathToNode(nodes: CreateFilePayload[], targetId: number, path: number[] | null = []): number[] | null {
    for (const node of nodes) {
        // @ts-ignore
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

export function findNodeById(nodes: CreateFilePayload[], targetId: number): CreateFilePayload | null {
    for (const node of nodes) {
        if (node.id === targetId) return node;
        if (node.children && node.children.length > 0) {
            const found = findNodeById(node.children, targetId);
            if (found) return found;
        }
    }
    return null;
}

export function openFoldersOnPathPreserveOthers(nodes: CreateFilePayload[], pathIds: number[]): CreateFilePayload[] {
    return nodes.map(node => {
        const newNode = {...node};
        if (newNode.type === FileType.Folder) {
            if (pathIds.includes(newNode.id as number)) {
                newNode.status = FileStatus.Opened;
            }
            if (newNode.children && newNode.children.length > 0) {
                newNode.children = openFoldersOnPathPreserveOthers(newNode.children, pathIds);
            }
        }
        return newNode;
    });
}

export function closeAllFilesExcept(nodes: CreateFilePayload[], openedFileId: number | null): CreateFilePayload[] {
    return nodes.map(node => {
        const newNode = {...node};
        if (newNode.type === FileType.File) {
            newNode.status = newNode.id === openedFileId ? FileStatus.Opened : FileStatus.Closed;
        }
        if (newNode.children && newNode.children.length > 0) {
            newNode.children = closeAllFilesExcept(newNode.children, openedFileId);
        }
        return newNode;
    });
}