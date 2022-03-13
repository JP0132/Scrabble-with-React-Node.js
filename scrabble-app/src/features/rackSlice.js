import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

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
            let newLetter = {
                letter: action.payload,
                id: uuidv4()
            }
            state.value.playerRack.push(newLetter);

        },
        removeFromPlayerRack: (state, action) => {
            console.log("Hekk",action.payload);
            state.value.playerRack.splice(action.payload, 1);

        }
        
    }
});

export const { addToPlayerRack, removeFromPlayerRack} = rackSlice.actions;

export default rackSlice.reducer;