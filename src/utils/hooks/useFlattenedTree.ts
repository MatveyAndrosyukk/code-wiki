import { useMemo } from 'react';
import {File, FileStatus, FileType} from "../../types/file";

export interface TreeNode {
    file: File;
    depth: number;
    index: number;
    isLastChild: boolean;
}

export const useFlattenedTree = (files: File[]): TreeNode[] => {
    return useMemo(() => {
        const flattened: TreeNode[] = [];

        const flattenNode = (node: File, depth: number, index: number, isLastChild: boolean) => {
            flattened.push({ file: node, depth, index, isLastChild });

            if (node.type === FileType.Folder && node.status === FileStatus.Opened && node.children) {
                node.children.forEach((child, childIdx) => {
                    const childIsLast = childIdx === node.children!.length - 1;
                    flattenNode(child, depth + 1, flattened.length, childIsLast);
                });
            }
        };

        files.forEach((root, idx) => {
            const isLast = idx === files.length - 1;
            flattenNode(root, 0, 0, isLast);
        });

        return flattened;
    }, [files]);
};