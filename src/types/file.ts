export enum FileType {
    File = 'File',
    Folder = 'Folder',
}

export enum FileStatus {
    Opened = 'Opened',
    Closed = 'Closed',
}

export interface File {
    id: number;
    likes: number;
    author: string;
    type: FileType;
    name: string;
    content: string;
    status: FileStatus;
    children: File[];
    parent: File | null;
}