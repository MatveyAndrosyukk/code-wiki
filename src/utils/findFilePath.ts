import {File} from "../types/file";

// Возвращает массив file.name от корневой папки до файла.
export default function findFilePath(nodes: File[], targetId: number, path: string[] = []): string[] | null {
    for (const node of nodes) {
        const currentPath = [...path, node.name];
        if (node.id === targetId) {
            return currentPath;
        }
        if (node.children && node.children.length > 0) {
            const found = findFilePath(node.children, targetId, currentPath);
            if (found) return found;
        }
    }
    return null;
}