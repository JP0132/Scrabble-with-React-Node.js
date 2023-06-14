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

//Display the swap rack component
const Swap = ({handleCancelSwap, setSwap}) => {
    //Hooks
    const dispatch = useDispatch();
    const tilesToSwap = useSelector((state) => state.rack.value.tilesToSwap);
    const gameMode = useSelector((state) => state.game.value.gameMode);

    //Which player rack it is
    let playerNumber;
    if(gameMode === "pvp"){
        let currentStore = storeSlicer.getState();
        playerNumber = currentStore.pvpgame.value.turnPlayer;
    }
    else{
        playerNumber = "player"
    }

    //State variables to track state
    const [swapTiles, setSwapTiles] = useState([]);
    const [disableCancel, setDisableCancel] = useState(false);
    const [disableOk, setOkDisable] = useState(false);

    //useEffect hook to change the state variable to disable ok and cancel buttons
    useEffect(() => {
        setSwapTiles(tilesToSwap);
        if(tilesToSwap.length > 0){
            
            setDisableCancel(true);
            setOkDisable(false);
        }
        else if(tilesToSwap.length === 0){
            
            setDisableCancel(false);
            setOkDisable(true);
        }
    }, [tilesToSwap]);

    //Dragging has stopped, add the tile to the rack
    const [{isOver}, drop] = useDrop(() => ({
        accept:"tile",
        drop: (item) => addToSwap(item.letterValue, item.id, item.index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    //Handles the adding
    const addToSwap = (letter, id, index) => {
        //Get the current tiles on the board
        let currentStore = storeSlicer.getState();
        let pos = currentStore.square.value.tilePositions;

        //Current tiles in the swap rack
        let tiles = currentStore.rack.value.tilesToSwap;

        //If the tile is on the board
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

        else if(!swapFound){
            let playerNo;
            if(gameMode === "pvp"){
                playerNo = currentStore.pvpgame.value.turnPlayer;
            }
            else{
                playerNo = "player";
            }
            dispatch(removeFromPlayerRack({index: index, playerNumber: playerNo+"Rack"}));
            dispatch(addToSwapRack(letter));
        }
        
    }

    //Confirming the swap, get new tiles to add the rack
    const confirmSwap = () => {
        let noOfTilesNeeded = tilesToSwap.length;
        let newTiles = DrawTiles(noOfTilesNeeded);
        let currentStore = storeSlicer.getState();
        let playerNo;
        if(gameMode === "pvp"){
            playerNo = currentStore.pvpgame.value.turnPlayer;
        }
        else{
            playerNo = "player";
        }

        for(let i = 0; i < newTiles.length; i++){
           dispatch(addToPlayerRack({letter: newTiles[i], playerNumber: playerNo+"Rack"}));
        }

        
        let tiles = currentStore.rack.value.tilesToSwap;

        for(let i = 0; i < tiles.length; i++){
            let currentLetter = tiles[i].letter;
            dispatch(addTileToBag(currentLetter));

        }
        dispatch(resetSwapRack());

        handleCancelSwap(true);
    }

    const handleCancelClick = () => {
        handleCancelSwap(false);
    }


    return(
        <div className="swapRack">
            <div ref={drop} className="place"> 
                {tilesToSwap.map((letter, index) => {
                    return <Tile key={uuidv4()} letter={letter.letter} id={letter.id} index={index}/>
                })}     
            </div>
            <div className='conBtn'>
                <button className="swapBtns" id="ok" onClick={confirmSwap} disabled={disableOk}>Ok</button>
                <button className="swapBtns" id="cancel" onClick={handleCancelClick} disabled={disableCancel}>Cancel</button>
            </div>
        </div>
    );
}
 
export default Swap;