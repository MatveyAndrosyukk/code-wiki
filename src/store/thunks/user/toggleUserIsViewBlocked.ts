import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import API_BASE_URL from "../../../config/api-config";

export const toggleUserIsViewBlocked = createAsyncThunk<User, string>(
    'user/toggleUserIsViewBlocked',
    async (email) => {
        const token = localStorage.getItem('token');

        const response = await fetch(
            `${API_BASE_URL}/users/isViewBlocked?email=${email}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || JSON.stringify(errorData));
        }
        return await response.json();
    }
)