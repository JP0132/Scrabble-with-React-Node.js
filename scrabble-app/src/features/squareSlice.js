import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        tilePositions: []
    }
}

export const squareSlice = createSlice({
    name: "square",
    initialState,
    reducers:{
        resetSquareState: (state, action) => {
            Object.assign(state, initialState);
       },
        addTile: (state, action)=> {
            let tileToAdd = {
                letter: action.payload.letter,
                id: action.payload.id,
                x: action.payload.x,
                y: action.payload.y
            }

            state.value.tilePositions.push(tileToAdd);
            
        },
        updateTilePosition: (state, action) =>{
            state.value.tilePositions[action.payload.index].x = action.payload.x;
            state.value.tilePositions[action.payload.index].y = action.payload.y;
        },
        removeFromSquare: (state, action) => {
            state.value.tilePositions.splice(action.payload, 1);
        },
        resetPos: (state, action) => {
            state.value.tilePositions = [];
        }
    }
})

export const { resetSquareState, addTile, updateTilePosition, removeFromSquare, resetPos } = squareSlice.actions;

export default squareSlice.reducer;