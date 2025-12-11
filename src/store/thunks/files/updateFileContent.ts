import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../../config/api-config";
import {CreateFilePayload} from "./createFile";

interface ChangeFileContentPayload {
    id: number;
    content: string;
    editor: string | undefined;
}

export const updateFileContent = createAsyncThunk<CreateFilePayload, ChangeFileContentPayload>(
    'fileTree/updateFileContent',
    async (body) => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/files/content`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            throw new Error('Failed to rename file on server');
        }

        return await response.json();
    }
)