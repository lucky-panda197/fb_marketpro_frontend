import { configureStore } from "@reduxjs/toolkit";
import { apiService } from "services/apiService";
import authReducer from "features/auth/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiService.reducerPath]: apiService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(apiService.middleware),
});
