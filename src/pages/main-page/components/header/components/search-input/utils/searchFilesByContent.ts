import {File} from "../../../../../../../types/file";
import {SearchResult} from "./searchFilesByName";
import {CreateFilePayload} from "../../../../../../../store/thunks/createFileOnServer";

export default function searchFilesByContent(
    nodes: CreateFilePayload[],
    query: string,
    path: string = ''
): SearchResult[] {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    let results: SearchResult[] = [];

    for (const node of nodes) {
        const currentPath = path ? `${path}/${node.name}` : node.name;
        const contentLower = node.content.toLowerCase();
        const idx = contentLower.indexOf(lowerQuery);

        if (idx !== -1) {
            results.push({
                id: node.id,
                type: node.type,
                name: node.name,
                content: node.content.substring(idx),
                fullPath: currentPath,
            } as SearchResult);
        }
        if (node.children && node.children.length > 0) {
            results = results.concat(searchFilesByContent(node.children, query, currentPath));
        }
    }
    return results;
}