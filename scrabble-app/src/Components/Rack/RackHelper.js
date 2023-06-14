
import {storeSlicer} from "../../app/store";

import { addTileToBag, removeTileFromBag } from "../../features/tilebagSlice";


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

