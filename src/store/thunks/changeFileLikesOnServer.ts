import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../config/api-config";
import {CreateFilePayload} from "./createFileOnServer";

export interface ChangeFileLikesPayload {
    id: number;
    email: string;
}

export const changeFileLikesOnServer = createAsyncThunk<CreateFilePayload, ChangeFileLikesPayload>(
    'fileTree/changeFileLikesOnServer',
    async (body, thunkApi) => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/files/like`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            throw new Error('Failed to like file on server');
        }

        return await response.json();
    }
)