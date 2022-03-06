import { createSlice } from "@reduxjs/toolkit";
import { UPDATE_PLAYER_RACK, UPDATE_COMPUTER_RACK, FETCH_PLAYER_RACK } from "../actions/types";


export const rackSlice = createSlice({
    name: "rack",
    initialState: {
        value: {
            playerRack: [],
            computerRack: []
            
        }
    },
    reducers: {
        updatePlayerRack: (state, action) => {
            state.value = action.payload;
          
         
            
        },

    }
});

export const { updatePlayerRack } = rackSlice.actions;


export default rackSlice.reducer;