import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../config/api-config";
import {CreateFilePayload} from "./createFileOnServer";

interface ChangeFileNamePayload {
    id: number;
    name: string;
}

export const changeFileNameOnServer = createAsyncThunk<CreateFilePayload, ChangeFileNamePayload>(
    'fileTree/changeFileNameOnServer',
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