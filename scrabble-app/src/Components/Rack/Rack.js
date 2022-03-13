import GameData from "../../JSONData/GameData.json";
import {DrawTiles} from "./RackHelper";
import Tile from "../Tile/Tile";
import "../../StyleSheets/Rack.css";
import { v4 as uuidv4 } from 'uuid';
import { useDrop } from "react-dnd";
import {storeSlicer} from "../../app/store";
import { useState, useEffect, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actioncreators } from "../../state/action-creator/allActionsCreators";
import { addToPlayerRack } from "../../features/rackSlice";
import { removeFromSquare } from "../../features/squareSlice";



const Rack = () => {
    //const playerRack = useSelector((state) => state.rack.playerRack);
    const playerRack = useSelector((state) => state.rack.value.playerRack);
    console.log(playerRack);
    const dispatch = useDispatch();

    const [userRack, setuserRack] = useState([]);

    //const { addLetterToPlayerRack, removeLetterOnPlayerRack } = bindActionCreators(actioncreators, dispatch);

    useEffect(() => {
        setuserRack(playerRack);
    }, [playerRack]);

    var newTiles;

    if(userRack.length < 7 && GameData.turnNumber == 0){
        let noOfTilesNeeded = 7 - userRack.length;
        newTiles = DrawTiles(noOfTilesNeeded);
        for(let i = 0; i < newTiles.length; i++){
            //addLetterToPlayerRack(newTiles[i]);
           dispatch(addToPlayerRack(newTiles[i]));
        }
        GameData.turnNumber += 1;
    }

    const [{isOver}, drop] = useDrop(() => ({

        accept:"tile",
        drop: (item) => addToRack(item.letterValue, item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }))

    const addToRack = (letter, id) => {
        let currentStore = storeSlicer.getState();
        let pos = currentStore.square.value.tilePositions;
        //const found = pos.some(el => el.id === id);
        let found = false;
        var foundObject;

        for(let i = 0; i < pos.length; i++){
            if(pos[i].id === id){
                found = true;
                foundObject = i;
            }
        }

        if(found){
            dispatch(removeFromSquare(foundObject));
            dispatch(addToPlayerRack(letter));
        }
      
    
    }

  
    return(
        <div ref={drop} className="rack">
            {playerRack.map((letter, index) => {
                return <Tile key={uuidv4()} letter={letter.letter} id={letter.id} index={index}/>
            })}
        </div>
    )

   

}


export default Rack;