import {createAsyncThunk} from "@reduxjs/toolkit";
import {File} from "../../types/file";
import API_BASE_URL from "../../config/api-config";

export const fetchFiles = createAsyncThunk<File[], string>(
    'fileTree/fetchFiles',
    async (email, thunkApi) => {
        const token = localStorage.getItem('token');

        const response = await fetch(
            `${API_BASE_URL}/files?email=${email}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        if (!response.ok) {
            throw new Error('Failed to fetch files');
        }
        return  await response.json();
    }
)