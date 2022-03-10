import { configureStore } from "@reduxjs/toolkit"
import rackReducer from "../features/rackSlice"
export const storeSlicer = configureStore({
    reducer: {
        rack: rackReducer,

    }
})
