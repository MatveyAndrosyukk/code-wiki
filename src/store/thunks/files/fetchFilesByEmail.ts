import {createAsyncThunk} from "@reduxjs/toolkit";
import API_BASE_URL from "../../../config/api-config";
import {CreateFilePayload} from "./createFile";

export const fetchFilesByEmail = createAsyncThunk<CreateFilePayload[], string>(
    'fileTree/fetchFilesByEmail',
    async (email) => {
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
        return await response.json();
    }
)