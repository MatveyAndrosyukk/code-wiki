import {File, FileStatus, FileType} from "../../types/file";

export function findAndUpdate(
    nodes: File[],
    id: number | null,
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

export function deepCloneWithNewIds(file: File): File {
    const newId = Date.now() + Math.floor(Math.random() * 1000000);
    return {
        ...file,
        id: newId,
        children: file.children
            ? file.children.map(child => deepCloneWithNewIds(child))
            : [],
    };
}

export function closeAllFiles(nodes: File[]): File[] {
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

export function closeAllChildren(nodes: File[]): File[] {
    return nodes.map(node => ({
        ...node,
        status: node.type === FileType.Folder ? FileStatus.Closed : node.status,
        children: node.children ? closeAllChildren(node.children) : [],
    }));
}

export function deleteById(
    nodes: File[],
    id: number | null
): File[] {
    return nodes
        .filter(node => node.id !== id)
        .map(node => ({
            ...node,
            children: node.children ? deleteById(node.children, id) : [],
        }));
}

export function findPathToNode(
    nodes: File[],
    targetId: number,
    path: number[] | null = []
): number[] | null {
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

export function openFoldersOnPathPreserveOthers(
    nodes: File[],
    pathIds: number[]
): File[] {
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

export function closeAllFilesExcept(
    nodes: File[],
    openedFileId: number | null
): File[] {
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