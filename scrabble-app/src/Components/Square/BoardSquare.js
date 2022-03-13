import Square from '../Square/Square';
import { boardMap } from './boardMap';
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { removeFromPlayerRack } from "../../features/rackSlice";
import { addTile, updateTilePosition } from "../../features/squareSlice";
import {storeSlicer} from "../../app/store";




const BoardSquare = ({x, y, sqType, pos, children}) => {
    

    const dispatch = useDispatch();

    const [{isOver}, drop] = useDrop(() => ({
        accept:"tile",
        drop: (item) => addToSquare(item.letterValue, item.id, item.index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))
    

    const addToSquare = (l, id, index) => {
        //console.log(index);
        let currentStore = storeSlicer.getState();
        let pos = currentStore.square.value.tilePositions;
        console.log("Positions",pos);
        let found = false;
        var foundObject;

        for(let i = 0; i < pos.length; i++){
            if(pos[i].id === id){
                found = true;
                foundObject = i;
            }
        }
        console.log("Found",found);
        if(found){
            console.log("updating");
            dispatch(updateTilePosition({id: id, index: foundObject, x: x, y: y}))
            console.log(pos);
           
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
   //TODO: Make the tile appear, try passing it to the square the orginal method again

}

export default BoardSquare;