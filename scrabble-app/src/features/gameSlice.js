import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    value: {
        playerScore: 0,
        computerScore: 0,
        turnNumber: 1,
        turnPlayer: "user",
        playerDrawn: false,
        computerDrawn: false
    }
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers:{
        increaseTurnNumber: (state, action) => {
            state.value.turnNumber += 1;
        },
        changeTurnPlayer: ( state, action) => {
            state.value.turnPlayer = action.payload;
        },
        increasePlayerScore: (state, action) => {
            state.value.playerScore += action.payload;
        },
        increaseComputerScore: (state, action) => {
            state.value.computerScore += action.payload;
        },
        hasPlayerTileDrawn: (state,action) => {
            state.value.playerDrawn = action.payload;

        },
        hasCompTileDrawn: (state,action) => {
            state.value.computerDrawn = action.payload;

        },

       
    }
});

export const {changeTurnPlayer, increaseTurnNumber, increasePlayerScore, increaseComputerScore, hasPlayerTileDrawn, hasCompTileDrawn } = gameSlice.actions;

export default gameSlice.reducer;