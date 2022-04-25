import Square from '../Square/Square';
import { boardMap } from './boardMap';
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { removeFromPlayerRack, removeFromSwapRack } from "../../features/rackSlice";
import { addTile, updateTilePosition } from "../../features/squareSlice";
import {storeSlicer} from "../../app/store";




const BoardSquare = ({x, y, sqType, pos, children}) => {
    

    const dispatch = useDispatch();

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

    const addToSquare = (l, id, index) => {
        //console.log(index);
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
        <div ref={drop} style={{position:'relative', width:'100%', height:'100%'}}>
            <Square sqType={sqType}>{children}</Square>
        </div>
    )

}

export default BoardSquare;