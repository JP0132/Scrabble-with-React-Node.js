import { createSlice } from "@reduxjs/toolkit";
import { withRouter } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    value: {
        computerRack: [],
        playerRack: [],
        player1Rack: [],
        player2Rack: [],
        player3Rack: [],
        player4Rack: [],
        tilesToSwap: []
    }
}

export const rackSlice = createSlice({
    name: "rack",
    initialState,
    reducers:{
        restRackState: (state, action) => {
            Object.assign(state, initialState);
        },
        setComputerRack: (state, action) => {
            state.value.computerRack = action.payload;
        },
        removeTileFromComputerRack:(state, action) =>{
            let index = state.value.computerRack.indexOf(action.payload);
            state.value.computerRack.splice(index, 1);
        },
        addToComputerRack: (state, action) => {
            for(let i = 0; i < action.payload.length; i++){
                state.value.computerRack.push(action.payload.length[i]);
            }
        },
        updateRack: (state, action) =>{
            for(let i = 0; i < action.payload.length; i++){
                state.value.computerRack.push(action.payload[i]);
            }
            
        },
        addToPlayerRack: (state, action) =>{
            let newLetter = {
                letter: action.payload.letter,
                id: uuidv4()
            }
            
            let whichPlayer = action.payload.playerNumber;
            state.value[whichPlayer].push(newLetter);

        },
        removeFromPlayerRack: (state, action) => {
            let whichPlayer = action.payload.playerNumber;
            state.value[whichPlayer].splice(action.payload.index, 1);

        },

        shuffleRack: (state, action) => {
            let whichPlayer = action.payload.playerNumber;
            state.value[whichPlayer] = action.payload.shuffleRack;
        },

        addToSwapRack: (state, action) => {
            let newLetter = {
                letter: action.payload,
                id: uuidv4()
            }
            //let whichPlayer = action.payload.playerNumber;
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

export const {restRackState, addToPlayerRack, removeFromPlayerRack, shuffleRack, addToSwapRack, removeFromSwapRack, resetSwapRack, setComputerRack, removeTileFromComputerRack, updateRack, addToComputerRack} = rackSlice.actions;

export default rackSlice.reducer;