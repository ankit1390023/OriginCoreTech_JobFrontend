import { configureStore } from "@reduxjs/toolkit";


export const store = configureStore({
    reducer: {
        student: studentReducer,
        auth: authReducer,
    }
})