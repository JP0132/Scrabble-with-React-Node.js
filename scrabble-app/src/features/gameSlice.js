import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

//Game Slice
const initialState = {
    value: {
        gameMode: "",
        playerScore: 0,
        computerScore: 0,
        turnNumber: 1,
        turnPlayer: "user",
        playerDrawn: false,
        computerDrawn: false,
        winnerName: "",
        winnerScore:0,
        losers: [],
        computerDifficulty: "",
    }
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers:{
        resetGameState: (state, action) => {
            Object.assign(state, initialState);
        },
        setComputerDifficulty: (state, action) => {
            state.value.computerDifficulty = action.payload;
        },
        setGameMode: (state, action) => {
            state.value.gameMode = action.payload;
        },
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

        setWinner: (state, action) => {
            state.value.winnerName = action.payload.name;
            state.value.winnerScore = action.payload.score;
        },
        
        setLosers: (state, action) => {
            let newObj = {name: action.payload.name, score: action.payload.score};
            state.value.losers.push(newObj);
            // state.value.loserScores = action.payload.scores;
            // state.value.loserNames = action.payload.names;
        },
     
        
    

       
    }
});

export const {resetGameState, changeTurnPlayer, increaseTurnNumber, increasePlayerScore, increaseComputerScore, hasPlayerTileDrawn, hasCompTileDrawn, setWinner, setLosers, setGameMode, setComputerDifficulty} = gameSlice.actions;

export default gameSlice.reducer;