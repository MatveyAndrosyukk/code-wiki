import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import API_BASE_URL from "../../../config/api-config";

export const fetchUser = createAsyncThunk<User, string>(
    'user/fetchUser',
    async (email, thunkApi) => {
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
        return  await response.json();
    }
)