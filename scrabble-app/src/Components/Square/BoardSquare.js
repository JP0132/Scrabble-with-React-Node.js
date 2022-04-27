import Square from '../Square/Square';
import { boardMap } from './boardMap';
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { removeFromPlayerRack, removeFromSwapRack } from "../../features/rackSlice";
import { addTile, updateTilePosition } from "../../features/squareSlice";
import {storeSlicer} from "../../app/store";
import { changeToBlank, removeBlanks } from '../../features/boardSlice';
import BlankTile from "../Tile/BlankTile";
import { useEffect, useState } from 'react';




const BoardSquare = ({x, y, sqType, pos, children, isBlank, aBlank}) => {
    

    const dispatch = useDispatch();

    const [blankValue, setBlankValue] = useState("");

    // useEffect(() => {
    //     let currentStore = storeSlicer.getState();
    //     let pos = currentStore.board.value.blanks;
    //     let tilePos = currentStore.square.value.tilePositions;
    //     if(pos.length !== 0){
    //         for(let i = 0; i < pos.length; i++){
    //             let bl = pos[i];
    //             for(let j = 0; j < tilePos.length; j++){
    //                 let currentTile = tilePos[j];
    //                 if(bl.x == currentTile.x && bl.y == currentTile.y){
    //                     console.log("hi");
                    
    //                 }
    //             }
                
    //         }
    //     }
        
       
    // }, [blankValue])

    const [{isOver}, drop] = useDrop(() => ({
        accept:"tile",
        canDrop: () => canDropOnSquare(x, y),
        drop: (item) => addToSquare(item.letterValue, item.id, item.index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))
    
    const canDropOnSquare = (x, y) => {
        let currentStore = storeSlicer.getState();
        let pos = currentStore.square.value.tilePositions;
        //console.log("Positions",pos);
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
    async function handleBlank(l, index, id){
        //let getBlank = await blank(true, x, y);
        let currentStore = storeSlicer.getState();
        let cb = currentStore.board.value.currentBlank;
       
        //Add the blank tile to blanks in the boardslice
        //In the tile have it filter through the tile
        return;
    }
    const [showBlank, setBlank] = useState(false);

    const addToSquare = async (l, id, index) => {
        //console.log(index);
        if(l == "?"){
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
      
        //console.log("Positions",pos);
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
        //console.log("Found",found);

        for(let i = 0; i < tiles.length; i++){
            if(tiles[i].id === id){
                swapFound = true;
                foundSwapObject = i;
            }
        }
        
        if(found){
            //console.log("updating");
            let currentStore = storeSlicer.getState();
            let blankPos = currentStore.board.value.blanks;
            let checkTile = pos[foundObject];
            if(blankPos.length !== 0){
                for(let i = 0; i < blankPos.length; i++){
                    let bl = blankPos[i];
                    if(bl.x == checkTile.x && bl.y == checkTile.y){
                        dispatch(removeBlanks(i));    
                    }   
                }
            }
           
            
            dispatch(updateTilePosition({id: id, index: foundObject, x: x, y: y}))
            //console.log(pos);
        }

        else if(swapFound){
            dispatch(removeFromSwapRack(foundSwapObject));
            dispatch(addTile({id: id, letter: l, x: x, y: y}));
        }

        else{
            dispatch(removeFromPlayerRack(index));
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