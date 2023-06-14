import Square from '../Square/Square';
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { removeFromPlayerRack, removeFromSwapRack } from "../../features/rackSlice";
import { addTile, updateTilePosition } from "../../features/squareSlice";
import {storeSlicer} from "../../app/store";
import { changeToBlank, removeBlanks } from '../../features/boardSlice';
import BlankTile from "../Tile/BlankTile";
import { useState } from 'react';



//Smart component for square, handles the drop method when adding a tile to the board
const BoardSquare = ({x, y, sqType, pos, children, isBlank, aBlank}) => {
    const gameMode = useSelector((state) => state.game.value.gameMode);

    const dispatch = useDispatch();

    const [blankValue, setBlankValue] = useState("");


    const [{isOver}, drop] = useDrop(() => ({
        accept:"tile",
        canDrop: () => canDropOnSquare(x, y),
        drop: (item) => addToSquare(item.letterValue, item.id, item.index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));
    
    //If the tile can drop on the square.
    //Check the coordinates against the tiles already on the board
    const canDropOnSquare = (x, y) => {
        let currentStore = storeSlicer.getState();
        let pos = currentStore.square.value.tilePositions;
    
        let found = true;
        var foundObject;

        for(let i = 0; i < pos.length; i++){
            if(pos[i].x === x && pos[i].y === y){
                found = false;
                return found;
            }
        }

        if(found){
            let currentStore = storeSlicer.getState();
            let currentBoard = currentStore.board.value.currentBoard;
            if(currentBoard[y][x] !== "*"){
                return false;
            }
            else{
                return true;
            }
        }
        
    }

    //Handles the blank
    async function handleBlank(l, index, id){
        
        let currentStore = storeSlicer.getState();
        let cb = currentStore.board.value.currentBlank;
        return;
    }
    const [showBlank, setBlank] = useState(false);

    //Add the tile to the square
    const addToSquare = async (l, id, index) => {
        //If blank set blank state to true
        //Will display the blank input to the user in the game
        if(l === "?"){
            setBlank(true);
            isBlank(true);
            dispatch(changeToBlank(true));
            let changeBlank = await handleBlank(l, index, id);
            let currentStore = storeSlicer.getState();
            let la = currentStore.board.value.blankValue;
        }
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
                break;
            }
        }
    
        for(let i = 0; i < tiles.length; i++){
            if(tiles[i].id === id){
                swapFound = true;
                foundSwapObject = i;
                break;
            }
        }
        
        //If tie already on the board, update its position
        if(found){
            let currentStore = storeSlicer.getState();
            let blankPos = currentStore.board.value.blanks;
            let checkTile = pos[foundObject];
            if(blankPos.length !== 0){
                for(let i = 0; i < blankPos.length; i++){
                    let bl = blankPos[i];
                    if(bl.x === checkTile.x && bl.y === checkTile.y){
                        dispatch(removeBlanks(i));    
                    }   
                }
            }
           
            
            dispatch(updateTilePosition({id: id, index: foundObject, x: x, y: y}))
            //
        }

        //If from swap, remove from the swap rack
        else if(swapFound){
            dispatch(removeFromSwapRack(foundSwapObject));
            dispatch(addTile({id: id, letter: l, x: x, y: y}));
        }

        //Else remove from the  players rack
        else{
            
            let currentStore = storeSlicer.getState();
            let playerNo;
            if(gameMode === "pvp"){
                playerNo = currentStore.pvpgame.value.turnPlayer;
            }
            else{
                playerNo = "player";
            }
            

            dispatch(removeFromPlayerRack({index: index, playerNumber: playerNo + "Rack"}));
            dispatch(addTile({id: id, letter: l, x: x, y: y}));
        }
      
      
     
    }
    
    return (
        <>
            {showBlank && <BlankTile blank={setBlank} setBValue={setBlankValue} x={x} y={y}/>}
            <div ref={drop} style={{position:'relative', width:'100%', height:'100%'}}>
                <Square sqType={sqType}>{children}</Square>
            </div>
        </>
       
    )

}

export default BoardSquare;