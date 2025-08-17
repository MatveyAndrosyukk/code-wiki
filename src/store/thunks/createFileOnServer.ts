import {createAsyncThunk} from "@reduxjs/toolkit";
import {File} from "../../types/file";
import API_BASE_URL from "../../config/api-config";

export interface CreateFilePayload {
    id: number | null;
    author: string | null;
    type: string;
    name: string;
    content: string;
    status: string | null;
    likes: number | null;
    children: CreateFilePayload[] | null;
    parent: number | { id: number } | null;
}

export const createFileOnServer = createAsyncThunk<CreateFilePayload, CreateFilePayload>(
    'fileTree/createFileOnServer',
    async (body, thunkApi) => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        if (!response.ok) {
            throw new Error('Failed to create file on server')
        }
        return await response.json();
    }
)