import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    value: {
        computerRack: [],
        playerRack: [],
        tilesToSwap: []
    }
}

export const rackSlice = createSlice({
    name: "rack",
    initialState,
    reducers:{
        setComputerRack: (state, action) => {
            state.value.computerRack = action.payload;

        },
        removeTileFromComputerRack:(state, action) =>{
            let index = state.value.computerRack .indexOf(action.payload);
            state.value.computerRack.splice(index, 1);
        },
        updateRack: (state, action) =>{
            for(let i = 0; i < action.payload.length; i++){
                state.value.computerRack.push(action.payload[i]);
            }
            console.log(state.value.computerRack);
            

        },
        addToPlayerRack: (state, action) =>{
            let newLetter = {
                letter: action.payload,
                id: uuidv4()
            }
            state.value.playerRack.push(newLetter);

        },
        removeFromPlayerRack: (state, action) => {
            //console.log("Letter to be removed",action.payload);
            state.value.playerRack.splice(action.payload, 1);

        },

        shuffleRack: (state, action) => {
            state.value.playerRack = action.payload;
        },

        addToSwapRack: (state, action) => {
            let newLetter = {
                letter: action.payload,
                id: uuidv4()
            }
            state.value.tilesToSwap.push(newLetter);
        },

        removeFromSwapRack: (state, action) => {
            state.value.tilesToSwap.splice(action.payload, 1);
        },
        resetSwapRack: (state, action) => {
            state.value.tilesToSwap = [];
        }

    }
});

export const { addToPlayerRack, removeFromPlayerRack, shuffleRack, addToSwapRack, removeFromSwapRack, resetSwapRack, setComputerRack, removeTileFromComputerRack, updateRack} = rackSlice.actions;

export default rackSlice.reducer;