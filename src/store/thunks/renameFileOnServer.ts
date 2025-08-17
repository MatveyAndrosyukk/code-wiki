import {createAsyncThunk} from "@reduxjs/toolkit";
import {File} from "../../types/file";
import API_BASE_URL from "../../config/api-config";

interface RenameFilePayload {
    id: number;
    name: string;
}

export const renameFileOnServer = createAsyncThunk<File, RenameFilePayload>(
    'fileTree/renameFileOnServer',
    async (body, thunkApi) => {
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