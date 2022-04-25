import LetterData from '../../JSONData/LetterData.json';
import {storeSlicer} from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { addTileToBag, removeTileFromBag } from "../../features/tilebagSlice";
import { useState, useEffect } from "react";

export function DrawTiles(num) {
    
    //const tilebag = useSelector((state) => state.tilebag.value);
    let currentStore = storeSlicer.getState();
    let tilebag = currentStore.tilebag.value
    // const [bag, setBag] = useState(tilebag);
    // useEffect(() => {
    //     setBag(tilebag);
    // }, [tilebag]);

    let rack = [];
    if(tilebag.bag === 0){
        return rack;
    }
    //console.log(tilebag.bag);
    for(let i = 0; i < num; i++){
        currentStore = storeSlicer.getState();
        tilebag = currentStore.tilebag.value
        if(tilebag.bag === 0){
            return rack;
        }

        let randomLetter = tilebag.letters[Math.floor(Math.random() * tilebag.letters.length)];
       
        //let noOfLetter = tilebag[randomLetter].number;
                    
        //tilebag[randomLetter].number = noOfLetter - 1;
        storeSlicer.dispatch(removeTileFromBag(randomLetter))
        //dispatch(removeTileFromBag(randomLetter));
        
        //noOfLetter = tilebag[randomLetter].number;

        // if(noOfLetter == 0){
        //     let index = tilebag.letters.indexOf(randomLetter);
        //     tilebag.letters.splice(index, 1);
        // }
                    
        rack.push(randomLetter);
        //let currentbag = tilebag.bag;
        //LetterData.bag = currentbag - 1;
        
    }
    return rack;
}

