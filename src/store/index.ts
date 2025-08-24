import {configureStore} from "@reduxjs/toolkit";
import fileTreeReducer from './slices/fileTreeSlice';
import userReducer from "./slices/userSlice";

export const store = configureStore({
    reducer: {
        fileTree: fileTreeReducer,
        user: userReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;