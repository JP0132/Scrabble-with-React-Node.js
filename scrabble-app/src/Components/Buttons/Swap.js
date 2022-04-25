import "../../StyleSheets/Swap.css";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {storeSlicer} from "../../app/store";
import { useState, useEffect, useContext, useMemo } from "react";
import { removeFromPlayerRack, addToPlayerRack} from "../../features/rackSlice";
import { removeFromSquare} from "../../features/squareSlice";
import { addToSwapRack, resetSwapRack } from "../../features/rackSlice";
import Tile from "../Tile/Tile";
import { v4 as uuidv4 } from 'uuid';
import {DrawTiles} from "../Rack/RackHelper";
import { addTileToBag } from "../../features/tilebagSlice";

const Swap = ({handleCancelSwap}) => {
    const dispatch = useDispatch();
    const tilesToSwap = useSelector((state) => state.rack.value.tilesToSwap);
    const [swapTiles, setSwapTiles] = useState([]);
    const [disableCancel, setDisableCancel] = useState(false);

    useEffect(() => {
        setSwapTiles(tilesToSwap);
        if(tilesToSwap.length > 0){
            console.log(tilesToSwap.length);
            setDisableCancel(true);
        }
        else if(tilesToSwap.length === 0){
            console.log(tilesToSwap.length);
            setDisableCancel(false);
        }
    }, [tilesToSwap]);


    const [{isOver}, drop] = useDrop(() => ({
        accept:"tile",
        drop: (item) => addToSwap(item.letterValue, item.id, item.index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    const addToSwap = (letter, id, index) => {
        let currentStore = storeSlicer.getState();
        let pos = currentStore.square.value.tilePositions;

        let tiles = currentStore.rack.value.tilesToSwap;

        let found = false;
        var foundObject;

        let swapFound = false;
        var foundSwapObject;

        for(let i = 0; i < pos.length; i++){
            if(pos[i].id === id){
                found = true;
                foundObject = i;
            }
        }

        for(let i = 0; i < tiles.length; i++){
            if(tiles[i].id === id){
                swapFound = true;
                foundSwapObject = i;
            }
        }

        if(found){
            dispatch(removeFromSquare(foundObject));
            dispatch(addToSwapRack(letter));
        }
        if(!swapFound){
            dispatch(removeFromPlayerRack(index));
            dispatch(addToSwapRack(letter));
        }
        
    }

    const confirmSwap = () => {
        let noOfTilesNeeded = tilesToSwap.length;
        let newTiles = DrawTiles(noOfTilesNeeded);
        for(let i = 0; i < newTiles.length; i++){
           dispatch(addToPlayerRack(newTiles[i]));
        }

        let currentStore = storeSlicer.getState();
        let tiles = currentStore.rack.value.tilesToSwap;

        for(let i = 0; i < tiles.length; i++){
            let currentLetter = tiles[i].letter;
            dispatch(addTileToBag(currentLetter));

        }
        dispatch(resetSwapRack());

        handleCancelSwap();

    }

    return(
        <div className="swapRack">
            <div ref={drop} className="place"> 
                {tilesToSwap.map((letter, index) => {
                    return <Tile key={uuidv4()} letter={letter.letter} id={letter.id} index={index}/>
                })}     
            </div>
            <div className='conBtn'>
                <button className="swapBtns" id="ok" onClick={confirmSwap}>Ok</button>
                <button className="swapBtns" id="cancel" onClick={handleCancelSwap} disabled={disableCancel}>Cancel</button>
            </div>
        </div>
    );
}
 
export default Swap;