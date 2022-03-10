import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        playerRack: []
    }
}

export const rackSlice = createSlice({
    name: "rack",
    initialState,
    reducers:{
        addToPlayerRack: (state, action) =>{
            state.value.playerRack.push(action.payload);

        },
        removeFromPlayerRack: (state, action) => {
            console.log("Hekk",action.payload);
            state.value.playerRack.splice(action.payload, 1);

        }
        
    }
});

export const { addToPlayerRack, removeFromPlayerRack} = rackSlice.actions;

export default rackSlice.reducer;