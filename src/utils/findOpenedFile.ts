import {File, FileStatus, FileType} from "../types/file";

// Из всех файлов ищет единственный открытый.
export default function findOpenedFile(nodes: File[]): File | null {
    for (const node of nodes) {
        if (node.type === FileType.File && node.status === FileStatus.Opened) {
            return node;
        }
        if (node.children) {
            const found = findOpenedFile(node.children);
            if (found) return found;
        }
    }
    return null;
};