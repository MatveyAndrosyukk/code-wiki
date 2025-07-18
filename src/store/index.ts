import {configureStore} from "@reduxjs/toolkit";
import fileTreeReducer from './slices/fileTreeSlice'

export const store = configureStore({
    reducer: {
        fileTree: fileTreeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;