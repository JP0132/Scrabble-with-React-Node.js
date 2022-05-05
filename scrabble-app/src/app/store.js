import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../features/boardSlice";
import gameReducer from "../features/gameSlice";
import rackReducer from "../features/rackSlice";
import squareReducer from "../features/squareSlice";
import tileBag from "../features/tilebagSlice";
import pvpgameReducer from "../features/pvpgameSlice";

//Sets up the redux store, containing all the reducers / redux slices
//Can access the state from the store slicer and be update using dispatch.
export const storeSlicer = configureStore({
    reducer: {
        game: gameReducer,
        pvpgame: pvpgameReducer,
        board: boardReducer,
        rack: rackReducer,
        square: squareReducer,
        tilebag: tileBag,
    }
})
