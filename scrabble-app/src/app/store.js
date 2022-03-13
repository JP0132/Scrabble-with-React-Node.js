import { configureStore } from "@reduxjs/toolkit";
import rackReducer from "../features/rackSlice";
import squareReducer from "../features/squareSlice";

export const storeSlicer = configureStore({
    reducer: {
        rack: rackReducer,
        square: squareReducer

    }
})
