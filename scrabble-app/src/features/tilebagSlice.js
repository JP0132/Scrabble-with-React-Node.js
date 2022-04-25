import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        "A":{"letter":"A", "number":9,"points":1},
        "B":{"letter":"B","number":2,"points":3},
        "C":{"letter":"C","number":2,"points":3},
        "D":{"letter":"D","number":4,"points":2},
        "E":{"letter":"E","number":12,"points":1},
        "F":{"letter":"F","number":2,"points":4},
        "G":{"letter":"G","number":3,"points":2},
        "H":{"letter":"H","number":2,"points":4},
        "I":{"letter":"I","number":9,"points":1},
        "J":{"letter":"J","number":1,"points":8},
        "K":{"letter":"K","number":1,"points":5},
        "L":{"letter":"L","number":4,"points":1},
        "M":{"letter":"M","number":2,"points":3},
        "N":{"letter":"N","number":6,"points":1},
        "O":{"letter":"O","number":8,"points":1},
        "P":{"letter":"P","number":2,"points":3},
        "Q":{"letter":"Q","number":1,"points":10},
        "R":{"letter":"R","number":6,"points":1},
        "S":{"letter":"S","number":4,"points":1},
        "T":{"letter":"T","number":6,"points":1},
        "U":{"letter":"U","number":4,"points":1},
        "V":{"letter":"V","number":2,"points":4},
        "W":{"letter":"W","number":2,"points":4},
        "X":{"letter":"X","number":1,"points":8},
        "Y":{"letter":"Y","number":2,"points":4},
        "Z":{"letter":"Z","number":1,"points":10},
        "?":{"number":2,"points":0},
        letters:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","?"],
        bag:100
    }
}

export const tilebagSlice = createSlice({
    name: "tilebag",
    initialState,
    reducers:{
        addTileToBag: (state, action) =>{
            if( state.value[action.payload].number == 0){
                state.value.letters.push(action.payload);
            }
            state.value[action.payload].number += 1;
            let currentBag = state.value.bag;
            state.value.bag =  currentBag + 1;

        },
        removeTileFromBag: (state, action) => {
            state.value[action.payload].number -= 1;

            let currentBag = state.value.bag;
            state.value.bag =  currentBag - 1;

            if(state.value[action.payload].number === 0){
                let index = state.value.letters.indexOf(action.payload);
                state.value.letters.splice(index, 1);
            }
            
        }

    
    }
});

export const { addTileToBag, removeTileFromBag} = tilebagSlice.actions;

export default tilebagSlice.reducer;