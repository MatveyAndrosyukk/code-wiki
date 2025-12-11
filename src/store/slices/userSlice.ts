import {createSlice} from "@reduxjs/toolkit";
import {fetchViewedUserByEmail} from "../thunks/user/fetchViewedUserByEmail";
import {addUserWhoCanEdit} from "../thunks/user/addUserWhoCanEdit";
import {deleteUserWhoCanEdit} from "../thunks/user/deleteUserWhoCanEdit";
import {changeUserName} from "../thunks/user/changeUserName";
import {toggleUserIsViewBlocked} from "../thunks/user/toggleUserIsViewBlocked";
import {fetchLoggedInUserByEmail} from "../thunks/user/fetchLoggedInUserByEmail";

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
    isPremium: boolean,
    isViewBlocked: boolean,
    amountOfFiles: number,
}

interface UserState {
    viewedUser: User | null;
    loggedInUser: User | null;
}

const initialState: UserState = {
    viewedUser: null,
    loggedInUser: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearViewedUser(state) {
            state.viewedUser = null;
        },
        clearLoggedInUser(state) {
            state.loggedInUser = null;
        },
        incrementUserFilesCount: (state, action) => {
            if (!state.viewedUser || state.viewedUser.email !== action.payload.email) {
                return;
            }
            state.viewedUser.amountOfFiles += action.payload.count;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchViewedUserByEmail.fulfilled, (state, action) => {
                state.viewedUser = action.payload;
            })
            .addCase(fetchViewedUserByEmail.rejected, (state) => {
                state.viewedUser = null;
            })
            .addCase(fetchLoggedInUserByEmail.fulfilled, (state, action) => {
                state.loggedInUser = action.payload;
            })
            .addCase(fetchLoggedInUserByEmail.rejected, (state) => {
                state.loggedInUser = null;
            })
            .addCase(addUserWhoCanEdit.fulfilled, (state, action) => {
                state.loggedInUser = action.payload;
            })
            .addCase(deleteUserWhoCanEdit.fulfilled, (state, action) => {
                state.loggedInUser = action.payload
            })
            .addCase(changeUserName.fulfilled, (state, action) => {
                state.loggedInUser = action.payload;
            })
            .addCase(toggleUserIsViewBlocked.fulfilled, (state, action) => {
                state.viewedUser = action.payload;
            })
    }
})

export const {
    clearViewedUser,
    clearLoggedInUser,
    incrementUserFilesCount
} = userSlice.actions;

export default userSlice.reducer;