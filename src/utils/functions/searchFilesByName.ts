import {FileType} from "../../types/file";
import {CreateFilePayload} from "../../store/thunks/files/createFile";

export interface SearchResult {
    id: number;
    type: FileType;
    name: string;
    fullPath: string;
    content: string;
}

export default function searchFilesByName(
    nodes: CreateFilePayload[],
    query: string,
    path: string = ''
): SearchResult[] {
    if (!query || nodes.length === 0) return [];
    const lowerQuery = query.toLowerCase();
    let results: SearchResult[] = [];

    for (const node of nodes) {
        const currentPath = path ? `${path}/${node.name}` : node.name;
        if (node.name.toLowerCase().startsWith(lowerQuery)) {
            results.push({
                id: node.id,
                type: node.type,
                name: node.name,
                fullPath: currentPath,
                content: node.content,
            } as SearchResult);
        }
        if (node.children && node.children.length > 0) {
            results = results.concat(searchFilesByName(node.children, query, currentPath));
        }
    }
    return results;
}