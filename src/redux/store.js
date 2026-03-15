import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import developerReducer from "./developerSlice";
import projectReducer from "./projectSlice";

const store = configureStore({
    reducer: {
        loaderReducer,
        developerReducer,
        projectReducer
    },
});

export default store;