import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import API_BASE_URL from "../../../config/api-config";

export const fetchLoggedInUserByEmail = createAsyncThunk<User, string | null>(
    'user/fetchLoggedInUserByEmail',
    async (email: string | null) => {
        const token = localStorage.getItem('token');

        const response = await fetch(
            `${API_BASE_URL}/users/findOne?email=${email}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return await response.json();
    }
)