import {createSlice} from "@reduxjs/toolkit";
import {fetchUser} from "../thunks/user/fetchUser";
import {addUserWhoCanEdit} from "../thunks/user/addUserWhoCanEdit";
import {deleteUserWhoCanEdit} from "../thunks/user/deleteUserWhoCanEdit";
import {changeUserName} from "../thunks/user/changeUserName";
import {changeUserIsViewBlocked} from "../thunks/user/changeUserIsViewBlocked";

export interface Role {
    id: number,
    value: string,
    description: string,
}

export interface User {
    id: number | null,
    email: string,
    name: string,
    banned: boolean,
    banReason: boolean,
    bannedAt: Date,
    roles: Role[],
    whoCanEdit: User[],
    isViewBlocked: boolean,
}

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUser(state) {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.user = null;
            })
            .addCase(addUserWhoCanEdit.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(deleteUserWhoCanEdit.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(changeUserName.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(changeUserIsViewBlocked.fulfilled, (state, action) => {
                state.user = action.payload;
            })
    }
})

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;