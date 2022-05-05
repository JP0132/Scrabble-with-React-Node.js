import LetterData from '../../JSONData/LetterData.json';
import {storeSlicer} from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { addTileToBag, removeTileFromBag } from "../../features/tilebagSlice";
import { useState, useEffect } from "react";

//Helper to draw the tiles.
export function DrawTiles(num) {
    

    let currentStore = storeSlicer.getState();
    let tilebag = currentStore.tilebag.value
   

    let rack = [];
    if(tilebag.bag === 0){
        return rack;
    }
 
    for(let i = 0; i < num; i++){
        currentStore = storeSlicer.getState();
        tilebag = currentStore.tilebag.value
        if(tilebag.bag === 0){
            return rack;
        }

        let randomLetter = tilebag.letters[Math.floor(Math.random() * tilebag.letters.length)];
       
    
        storeSlicer.dispatch(removeTileFromBag(randomLetter))
          
        rack.push(randomLetter);
    }
    return rack;
}

