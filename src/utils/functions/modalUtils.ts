import {ActionType} from "../supporting-hooks/useModalActions";
import {File} from "../../types/file";

export function findNodeById(nodes: File[], id: number | null): File | null {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.type === 'Folder' && node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
}

export function checkIfNameExistsInFolder(
    files: File[],
    folderId: number | null,
    name: string
): boolean {
    function findFolderById(nodes: File[]): File | null {
        for (const node of nodes) {
            if (node.id === folderId && node.type === 'Folder') return node;
            if (node.type === 'Folder' && node.children) {
                const found = findFolderById(node.children);
                if (found) return found;
            }
        }
        return null;
    }

    const targetFolder = findFolderById(files);
    if (targetFolder && targetFolder.children) {
        return targetFolder.children.some(child => child.name === name);
    }
    return false;
}

export function isNameExistsInRoot(files: File[], name: string): boolean {
    return files.some(file => file.name === name);
}

export function handleNameConflictInFolder(
    files: File[],
    id: number | null,
    name: string,
    reason: ActionType,
    openModalByReasonHandler: (payload: { reason: ActionType; id: number | null, title: string }) => void
): boolean {
    if (id === null) return true;
    if (checkIfNameExistsInFolder(files, id, name)) {
        switch (reason) {
            case ActionType.AddFile:
            case ActionType.ResolveNameConflictAddFile:
                openModalByReasonHandler({reason: ActionType.ResolveNameConflictAddFile, id, title: "Add file"});
                break;
            case ActionType.AddFolder:
            case ActionType.ResolveNameConflictAddFolder:
                openModalByReasonHandler({reason: ActionType.ResolveNameConflictAddFolder, id, title: "Add folder"});
                break;
            case ActionType.ResolveNameConflictPaste:
                openModalByReasonHandler({reason: ActionType.ResolveNameConflictPaste, id, title: "Paste file"});
                break;
            case ActionType.ResolveNameConflictRename:
                openModalByReasonHandler({reason: ActionType.ResolveNameConflictRename, id, title: "Rename file"});
                break;
        }
        return true;
    }
    return false;
}

export function createFilePayload(
    name: string,
    author: string | null,
    type: 'File' | 'Folder',
    parent: number | null,
    extraFields?: Partial<File>
): File {
    return {
        id: null,
        status: null,
        likes: null,
        children: null,
        lastEditor: null,
        author,
        type,
        name,
        content: '',
        parent,
        ...extraFields,
    };
}