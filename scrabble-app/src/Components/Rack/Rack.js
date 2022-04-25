import GameData from "../../JSONData/GameData.json";
import {DrawTiles} from "./RackHelper";
import Tile from "../Tile/Tile";
import "../../StyleSheets/Rack.css";
import { v4 as uuidv4 } from 'uuid';
import { useDrop } from "react-dnd";
import {storeSlicer} from "../../app/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actioncreators } from "../../state/action-creator/allActionsCreators";
import { addToPlayerRack, removeFromSwapRack } from "../../features/rackSlice";
import { removeFromSquare} from "../../features/squareSlice";
import RackBtn from '../Buttons/RackBtn';
import { setComputerRack } from "../../features/rackSlice";
import { hasCompTileDrawn, hasPlayerTileDrawn } from "../../features/gameSlice";


const Rack = ({handlePlayWord, tn}) => {
    //const playerRack = useSelector((state) => state.rack.playerRack);
    const playerRack = useSelector((state) => state.rack.value.playerRack);
    //console.log(playerRack);
    const dispatch = useDispatch();

    const [userRack, setuserRack] = useState([]);

    //const { addLetterToPlayerRack, removeLetterOnPlayerRack } = bindActionCreators(actioncreators, dispatch);

    useEffect(() => {
        setuserRack(playerRack);
    }, [playerRack]);

    var turnNumber = useSelector((state) => state.game.value.turnNumber);
    var playerTd = useSelector((state) => state.game.value.playerDrawn);
    

    useEffect(() => {
        
        if(userRack.length < 7 && playerTd == false){
            let noOfTilesNeeded = 7 - userRack.length;
            let newTiles;
            newTiles = DrawTiles(noOfTilesNeeded);
            for(let i = 0; i < newTiles.length; i++){
               dispatch(addToPlayerRack(newTiles[i]));
            }
            dispatch(hasPlayerTileDrawn(true));
        }
        // else{
        //     dispatch(hasPlayerTileDrawn(false));
        // }
        
    }, [playerTd]);

    useEffect(() => {
        if(turnNumber == 1 && computerTd == false){
            let compRack = DrawTiles(7);
            dispatch(setComputerRack(compRack));
            dispatch(hasCompTileDrawn(true));
        }
    }, []);
    

    
    
    // console.log(turnNumber);
    // if(turnNumber == 1 && tilesDrawn == false){
    //     setTilesDrawn(true);
    //     let playerStartingRack = DrawTiles(7);
    //     for(let i = 0; i < playerStartingRack.length; i++){
    //         dispatch(addToPlayerRack(playerStartingRack[i]));
    //     }
    // }

   
    
    const computerTd = useSelector((state) => state.game.value.playerDrawn);

    // if(turnNumber % 2 == 1 && playerTd == true){
    //     dispatch(hasPlayerTileDrawn(false));
    // }

 

  

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
        let tiles = currentStore.rack.value.tilesToSwap;
        //const found = pos.some(el => el.id === id);
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
            dispatch(addToPlayerRack(letter));
        }
        else if(swapFound){
            dispatch(removeFromSwapRack(foundSwapObject));
            dispatch(addToPlayerRack(letter));
        }
      
    
    }

  
    return(
        <div className="rack">
            <div ref={drop} className="rackPlace"> 
            {playerRack.map((letter, index) => {
                return <Tile key={uuidv4()} letter={letter.letter} id={letter.id} index={index}/>
            })}   
            </div>
            <div className='btnCon'>
                <RackBtn key="playBtn" handleAction={handlePlayWord} text={"PLAY"}/>
                <RackBtn key="passBtn" handleAction={handlePlayWord} text={"PASS"}/>        
            </div>
        </div>
    );
    

   

}


export default Rack;