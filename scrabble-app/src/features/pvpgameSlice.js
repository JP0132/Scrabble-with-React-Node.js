import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
    value: {
        player1Name: "",
        player2Name:"",
        player1Score: 0,
        player2Score: 0,
        player3Name: "",
        player4Name:"",
        player3Score: 0,
        player4Score: 0,
        turnNumber: 1,
        turnPlayer: "",
        player1Drawn: false,
        player2Drawn: false,
        player3Drawn: false,
        player4Drawn: false,
        winnerName: "",
        winnerScore:0,
        loserNames: [],
        loserScores: [],
        noOfPlayers: 0,

    }
}

export const pvpgameSlice = createSlice({
    name: "pvpgame",
    initialState,
    reducers:{
        restPvPState: (state, action) => {
            Object.assign(state, initialState);
        },
        setNoOfPlayers: (state, action) => {
            state.value.noOfPlayers = action.payload;

        },
        setPlayerName:(state, action) => {
            let playerNum = action.payload.playerNumber + "Name";
            state.value[playerNum] = action.payload.playerName;

        },
        increaseTurnNumber: (state, action) => {
            state.value.turnNumber += 1;
        },
        changeTurnPvPPlayer: ( state, action) => {
            state.value.turnPlayer = action.payload;
        },
        increasePlayerNumScore: (state, action) => {
            let playerNum = action.payload.playerNumber;
            state.value[playerNum] += action.payload.score;
        },
       
        hasPvPTileDrawn: (state,action) => {
            let playerNum = action.payload.playerNumber;
            state.value[playerNum] = action.payload.draw;
        },
       
        setWinner: (state, action) => {
            state.value.winnerName = action.payload.name;
            state.value.winnerScore = action.payload.score;
        },
        
        setLosers: (state, action) => {
            state.value.loserScores = action.payload.scores;
            state.value.loserNames = action.payload.names;
        },
     
        
    

       
    }
});

export const { setNoOfPlayers, restPvPState, changeTurnPvPPlayer, increaseTurnNumber, increasePlayerNumScore, hasPvPTileDrawn, setPlayerName, setWinner, setLosers } = pvpgameSlice.actions;

export default pvpgameSlice.reducer;