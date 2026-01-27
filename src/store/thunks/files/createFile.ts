import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../../config/api-config";

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
    lastEditor: string | null;
}

export const createFile = createAsyncThunk<CreateFilePayload, CreateFilePayload>(
    'fileTree/createFile',
    async (body) => {
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