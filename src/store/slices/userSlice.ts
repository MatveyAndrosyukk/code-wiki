import {createSlice} from "@reduxjs/toolkit";
import {fetchUser} from "../thunks/user/fetchUser";
import {addUserWhoCanEdit} from "../thunks/user/addUserWhoCanEdit";
import {deleteUserWhoCanEdit} from "../thunks/user/deleteUserWhoCanEdit";
import {changeUserName} from "../thunks/user/changeUserName";

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
    whoCanEdit: User[]
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
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
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
    }
})

export default userSlice.reducer;