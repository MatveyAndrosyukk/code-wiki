import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import API_BASE_URL from "../../../config/api-config";

export interface UserWhoCanEditPayload {
    userEmail: string;
    whoCanEditEmail: string;
}

export const addUserWhoCanEdit = createAsyncThunk<User, UserWhoCanEditPayload>(
    'user/addUserWhoCanEdit',
    async (body) => {
        const token = localStorage.getItem('token');

        const response = await fetch(
            `${API_BASE_URL}/users/whoCanEdit`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData.message);
            if (errorData.message.includes('User with email')) {
                throw new Error('User does not exists');
            }else {
                throw new Error(errorData.message || JSON.stringify(errorData));
            }

        }
        return await response.json();
    }
)