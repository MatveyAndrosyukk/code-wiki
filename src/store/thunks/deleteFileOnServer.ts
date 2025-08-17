import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../config/api-config";

export const deleteFileOnServer = createAsyncThunk<number, number>(
    'fileTree/deleteFileOnServer',
    async (id, thunkApi) => {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/files/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })

        if (!response.ok) {
            throw new Error('Failed to delete file on server');
        }

        return await response.json();
    }
)