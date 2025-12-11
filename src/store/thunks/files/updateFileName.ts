import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../../config/api-config";
import {File} from "../../../types/file";

interface ChangeFileNamePayload {
    id: number;
    name: string;
}

export const updateFileName = createAsyncThunk<File, ChangeFileNamePayload>(
    'fileTree/updateFileName',
    async (body) => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/files/rename`, {
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