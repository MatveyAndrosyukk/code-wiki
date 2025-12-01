import {FileStatus, FileType} from "../../types/file";
import {CreateFilePayload} from "../../store/thunks/files/createFile";

export default function findOpenedFile(nodes: CreateFilePayload[]): CreateFilePayload | null {
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