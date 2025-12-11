import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../../config/api-config";

interface DeleteFilePayload {
    id: number | null;
    email: string | undefined;
}

export const deleteFileById = createAsyncThunk<number, DeleteFilePayload>(
    'fileTree/deleteFileById',
    async (body) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/files`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            throw new Error('Failed to delete file on server');
        }

        return await response.json();
    }
)