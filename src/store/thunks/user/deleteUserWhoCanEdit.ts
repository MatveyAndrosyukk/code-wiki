import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "../../slices/userSlice";
import API_BASE_URL from "../../../config/api-config";
import {UserWhoCanEditPayload} from "./addUserWhoCanEdit";

export const deleteUserWhoCanEdit = createAsyncThunk<User, UserWhoCanEditPayload>(
    'user/deleteUserWhoCanEdit',
    async (body, thunkApi) => {
        const token = localStorage.getItem('token');

        const response = await fetch(
            `${API_BASE_URL}/users/whoCanEdit`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );
        if (!response.ok) {
            throw new Error(`Failed to delete user from editors!`);
        }
        return  await response.json();
    }
)