import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../features/boardSlice";
import gameReducer from "../features/gameSlice";
import rackReducer from "../features/rackSlice";
import squareReducer from "../features/squareSlice";
import tileBag from "../features/tilebagSlice";

export const storeSlicer = configureStore({
    reducer: {
        game: gameReducer,
        board: boardReducer,
        rack: rackReducer,
        square: squareReducer,
        tilebag: tileBag,
    }
})
